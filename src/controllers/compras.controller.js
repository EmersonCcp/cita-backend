import { QueryTypes } from "sequelize";
import { Compra } from "../models/Compra.js";
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
          c.com_factura,
          p.prov_nombre AS proveedor
      FROM 
          compras c
      JOIN 
          proveedores p ON c.fk_proveedor = p.prov_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY c.com_codigo ASC
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
