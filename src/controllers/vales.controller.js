import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Vale } from "../models/Vale.js";
import {
  // getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

const searchableFields = [
  "v.vale_monto",
  "v.vale_descripcion",
  "v.vale_fecha",
  "v.vale_estado",
];

export const getAllWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query } = req.params;

    let queryAdd = ``;
    if (query && query !== ":query") {
      const conditions = searchableFields
        .map((field) => {
          return `${field}::VARCHAR ILIKE '%${query}%'`;
        })
        .join(" OR ");

      queryAdd = `WHERE (${conditions})`;
    }

    const sql = `
        SELECT 
          v.vale_codigo,
          f.fun_codigo AS fk_funcionario,
          CONCAT(f.fun_nombre, ' ', f.fun_apellido) AS funcionario,
          v.vale_fecha AS fecha,
          v.vale_estado AS estado,
          v.vale_monto AS monto
        FROM  vales v
        INNER JOIN funcionarios f ON v.fk_funcionario = f.fun_codigo
        ${queryAdd}
        ORDER BY  v.vale_fecha ASC
        LIMIT ${limit}
        OFFSET ${pagination}
      `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getVale = getOne(Vale, "vale_codigo");
export const createVale = create(Vale);
export const updateVale = update(Vale, "vale_codigo");
export const deleteVale = remove(Vale, "vale_codigo");
