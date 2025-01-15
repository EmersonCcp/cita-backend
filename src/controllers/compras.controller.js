import { QueryTypes } from "sequelize";
import { Compra } from "../models/Compra.js";
import { Producto } from "../models/Producto.js";
import { DetalleCompra } from "../models/DetalleCompra.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { sequelize } from "../database/database.js";

export const getCompras = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

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

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCompra = getOne(Compra, "com_codigo");
export const createCompra = create(Compra);
export const updateCompra = update(Compra, "com_codigo");
export const deleteCompra = remove(Compra, "com_codigo");

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
