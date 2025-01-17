import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Deuda } from "../models/Deuda.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { client } from "../index.js";

export const getDeudasWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    const redisKey = `${Deuda.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "c2.prov_nombre",
        "c.deuda_monto_total",
        "c.deuda_estado",
        "c.deuda_fecha",
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
        ? `AND v.fk_empresa = :fk_empresa` // Si ya hay condiciones, agrega con AND
        : `WHERE v.fk_empresa = :fk_empresa`; // Si no hay condiciones, usa WHERE
    }

    let sql = `
      SELECT 
          c.deuda_codigo, 
          c.deuda_fecha, 
          c.deuda_monto_total, 
          c.deuda_estado, 
          c.deuda_num_cuotas, 
          c.fk_compra,
          c2.prov_nombre AS proveedor
      FROM 
          deudas c
      JOIN 
          compras v ON c.fk_compra = v.com_codigo
      JOIN 
          proveedores c2 ON v.fk_proveedor = c2.prov_codigo 
      ${queryAdd} ${empresaCondition}
      ORDER BY c.deuda_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Pasar el valor de fk_empresa a la consulta
    });

    if (items.length > 0) {
      await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getDeuda = getOne(Deuda, "deuda_codigo");
export const createDeuda = create(Deuda);
export const updateDeuda = update(Deuda, "deuda_codigo");
export const deleteDeuda = remove(Deuda, "deuda_codigo");
