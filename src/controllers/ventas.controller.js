import { QueryTypes } from "sequelize";
import { Venta } from "../models/Venta.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { sequelize } from "../database/database.js";
import { errorHandler } from "../utils/errorHandler.js";
import { deleteKeysByPattern } from "../middleware/redisMiddleware.js";
import { client } from "../index.js";

export const getVentas = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    const redisKey = `${Venta.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "v.ven_codigo",
        "c.cli_nombre",
        "c.cli_apellido",
        "v.ven_factura",
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
        ? `AND v.fk_empresa = :fk_empresa`
        : `WHERE v.fk_empresa = :fk_empresa`;
    }

    let sql = `
      SELECT 
        v.ven_codigo,
        v.ven_precio_total,
        v.ven_fecha,
        v.ven_factura,
        v.ven_estado_entrega,
        CONCAT(c.cli_nombre, ' ', c.cli_apellido) AS cliente
      FROM 
        ventas v
      JOIN 
        clientes c ON v.fk_cliente = c.cli_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY v.ven_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Pasar el valor de fk_empresa como reemplazo
    });

    if (items.length > 0) {
      await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getVenta = getOne(Venta, "ven_codigo");
export const createVenta = create(Venta);
export const updateVenta = update(Venta, "ven_codigo");
// export const deleteVenta = remove(Venta, "ven_codigo");

export const deleteVenta = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id, fk_empresa } = req.params;

    // Consultar en la base de datos
    const item = await Venta.findOne({
      where: { ven_codigo: id, fk_empresa },
      transaction,
    });

    if (!item) {
      return res
        .status(404)
        .json({ ok: false, message: "Registro no encontrado" });
    }

    if (item.ven_estado_entrega === "entregado") {
      const sqlUpdateStock = `SELECT fk_producto, dv_cantidad FROM detalle_ventas WHERE fk_venta = ${item.ven_codigo};`;

      const detalles = await sequelize.query(sqlUpdateStock, {
        type: QueryTypes.SELECT,
        transaction,
      });

      if (detalles.length > 0) {
        // Agrupar productos por ID y sumar cantidades
        const productosAgrupados = detalles.reduce(
          (acc, { fk_producto, dv_cantidad }) => {
            acc[fk_producto] = (acc[fk_producto] || 0) + dv_cantidad;
            return acc;
          },
          {}
        );

        // Actualizar el stock según el cambio de estado
        for (const [fk_producto, cantidad] of Object.entries(
          productosAgrupados
        )) {
          const sqlUpdate = `UPDATE productos
                             SET prod_cantidad = prod_cantidad + ${cantidad}
                             WHERE prod_codigo = ${fk_producto}`;
          await sequelize.query(sqlUpdate, {
            type: QueryTypes.UPDATE,
            transaction,
          });
        }
      }
    }

    // Eliminar cuotas
    const sqlDeleteCuotas = `DELETE FROM cuotas WHERE cuo_tipo_operacion = 'venta' AND fk_operacion = ${id}`;
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
      caja_saldo_actual = caja_saldo_actual - tm.total_monto
    FROM 
      TotalMovimientos tm
    WHERE 
      cajas.caja_codigo = tm.fk_caja;`;
    await sequelize.query(sqlDevolverStock, { transaction });

    // Eliminar movimientos de caja
    const sqlMovimientoCaja = `DELETE FROM movimientos_cajas WHERE fk_operacion = ${id} AND mc_tipo_operacion = 'venta'`;
    await sequelize.query(sqlMovimientoCaja, {
      type: QueryTypes.DELETE,
      transaction,
    });

    // Intentar eliminar el registro de la base de datos
    const deleted = await Venta.destroy({
      where: { ven_codigo: id, fk_empresa },
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
      `${Venta.name}:list:fk_empresa=${fk_empresa}:`,
      Venta.name,
      fk_empresa
    );

    const redisKey = `${Venta.name}:${id}`;
    await client.del(redisKey);

    await transaction.commit();

    res.json({ ok: true, message: "Registro eliminado exitosamente" });
  } catch (error) {
    await transaction.rollback();
    errorHandler(res, error);
  }
};
