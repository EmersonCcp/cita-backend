import { QueryTypes } from "sequelize";
import { Compra } from "../models/Compra.js";
import { Producto } from "../models/Producto.js";
import { DetalleCompra } from "../models/DetalleCompra.js";
import { errorHandler } from "../utils/errorHandler.js";
import { deleteKeysByPattern } from "../middleware/redisMiddleware.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { sequelize } from "../database/database.js";
import { client } from "../index.js";

export const getCompras = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    const redisKey = `${Compra.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "c.com_codigo",
        "p.prov_nombre",
        "c.com_factura",
      ];
      const conditions = searchableFields
        .map((field) => {
          return `${field}::VARCHAR ILIKE '%${query}%'`;
        })
        .join(" OR ");

      queryAdd = `WHERE (${conditions})`;
    }

    // Agrega la condición para fk_empresa
    let empresaCondition = ``;
    if (fk_empresa) {
      empresaCondition = queryAdd
        ? `AND c.fk_empresa = :fk_empresa`
        : `WHERE c.fk_empresa = :fk_empresa`;
    }

    let sql = `
      SELECT 
          c.com_codigo,
          c.com_precio_total,
          c.com_fecha_compra,
          c.com_estado_entrega,
          c.com_factura,
          p.prov_nombre AS proveedor
      FROM 
          compras c
      JOIN 
          proveedores p ON c.fk_proveedor = p.prov_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY c.com_fecha_compra DESC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Se usa para pasar el valor de fk_empresa
    });

    if (items.length > 0) {
      await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCompra = getOne(Compra, "com_codigo");
export const createCompra = create(Compra);
export const updateCompra = update(Compra, "com_codigo");
// export const deleteCompra = remove(Compra, "com_codigo");

export const deleteCompra = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id, fk_empresa } = req.params;

    // Consultar en la base de datos
    const item = await Compra.findOne({
      where: { com_codigo: id, fk_empresa },
      transaction,
    });

    if (!item) {
      return res
        .status(404)
        .json({ ok: false, message: "Registro no encontrado" });
    }

    if (item.com_estado_entrega === "entregado") {
      const sqlUpdateStock = `SELECT fk_producto, dc_cantidad FROM detalle_compras WHERE fk_compra = ${item.com_codigo};`;

      const detalles = await sequelize.query(sqlUpdateStock, {
        type: QueryTypes.SELECT,
        transaction,
      });

      if (detalles.length > 0) {
        // Agrupar productos por ID y sumar cantidades
        const productosAgrupados = detalles.reduce(
          (acc, { fk_producto, dc_cantidad }) => {
            acc[fk_producto] = (acc[fk_producto] || 0) + dc_cantidad;
            return acc;
          },
          {}
        );

        // Actualizar el stock según el cambio de estado
        for (const [fk_producto, cantidad] of Object.entries(
          productosAgrupados
        )) {
          const sqlUpdate = `UPDATE productos
                             SET prod_cantidad = prod_cantidad - ${cantidad}
                             WHERE prod_codigo = ${fk_producto}`;
          await sequelize.query(sqlUpdate, {
            type: QueryTypes.UPDATE,
            transaction,
          });
        }
      }
    }

    // Eliminar cuotas
    const sqlDeleteCuotas = `DELETE FROM cuotas WHERE cuo_tipo_operacion = 'compra' AND fk_operacion = ${id}`;
    await sequelize.query(sqlDeleteCuotas, {
      type: QueryTypes.DELETE,
      transaction,
    });

    // Devolver saldo a las cajas
    const sqlDevolverStock = `WITH TotalMovimientos AS (
      SELECT 
        fk_caja, 
        SUM(mc_monto) AS total_monto
      FROM 
        movimientos_cajas
      WHERE 
        fk_operacion = ${id} 
      GROUP BY 
        fk_caja
    )
    
    UPDATE 
      cajas
    SET 
      caja_saldo_actual = caja_saldo_actual + tm.total_monto
    FROM 
      TotalMovimientos tm
    WHERE 
      cajas.caja_codigo = tm.fk_caja;`;
    await sequelize.query(sqlDevolverStock, { transaction });

    // Eliminar movimientos de caja
    const sqlMovimientoCaja = `DELETE FROM movimientos_cajas WHERE fk_operacion = ${id} AND mc_tipo_operacion = 'compra'`;
    await sequelize.query(sqlMovimientoCaja, {
      type: QueryTypes.DELETE,
      transaction,
    });

    // Intentar eliminar el registro de la base de datos
    const deleted = await Compra.destroy({
      where: { com_codigo: id, fk_empresa },
      transaction,
    });

    if (!deleted) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ ok: false, message: "Registro no encontrado" });
    }

    // Limpiar las claves en Redis
    await deleteKeysByPattern(
      `${Compra.name}:list:fk_empresa=${fk_empresa}:`,
      Compra.name,
      fk_empresa
    );

    const redisKey = `${Compra.name}:${id}`;
    await client.del(redisKey);

    await transaction.commit();

    res.json({ ok: true, message: "Registro eliminado exitosamente" });
  } catch (error) {
    await transaction.rollback();
    errorHandler(res, error);
  }
};

export const actualizarEstadoEntrega = async (compraId, nuevoEstado) => {
  try {
    // Obtener la compra actual y su estado
    const compra = await Compra.findByPk(compraId);
    if (!compra) throw new Error("Compra no encontrada");

    // Validar cambios de estado
    const estadoAnterior = compra.com_estado_entrega;
    if (estadoAnterior === nuevoEstado) {
      throw new Error("El estado ya es el mismo");
    }

    // Obtener detalles de la compra
    const detallesCompra = await DetalleCompra.findAll({
      where: { fk_compra: compraId },
    });

    // Realizar acciones según el nuevo estado
    switch (nuevoEstado) {
      case "pendiente":
        // No afecta el stock
        break;

      case "proceso":
        // Si se requiere, puedes marcar productos como reservados
        break;

      case "entregado":
        if (estadoAnterior !== "entregado") {
          // Actualizar el stock de cada producto
          for (const detalle of detallesCompra) {
            const producto = await Producto.findByPk(detalle.fk_producto);
            if (!producto) continue;

            // Aumentar el stock
            producto.prod_cantidad += detalle.dc_cantidad;
            await producto.save();
          }
        }
        break;

      case "cancelado":
        if (estadoAnterior === "entregado") {
          // Revertir el stock
          for (const detalle of detallesCompra) {
            const producto = await Producto.findByPk(detalle.fk_producto);
            if (!producto) continue;

            // Reducir el stock
            producto.prod_cantidad -= detalle.dc_cantidad;
            await producto.save();
          }
        }
        break;

      default:
        throw new Error("Estado no válido");
    }

    // Actualizar el estado de la compra
    compra.com_estado_entrega = nuevoEstado;
    await compra.save();

    return { ok: true, message: "Estado de entrega actualizado correctamente" };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};
