import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { HoraExtra } from "../models/HoraExtra.js";
import { getOne, create, update, remove } from "../utils/crudController.js";

const searchableFields = ["p.hr_monto", "p.hr_fecha"];

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
          h.he_codigo,
          f.fun_codigo AS fk_funcionario,
          CONCAT(f.fun_nombre, ' ', f.fun_apellido) AS funcionario,
          h.he_fecha AS fecha,
          h.he_horas AS horas,
          h.he_pago_hora AS pago_hora,
          h.he_estado AS estado,
          h.he_monto AS monto
        FROM  "horas_extras" h
        INNER JOIN funcionarios f ON h.fk_funcionario = f.fun_codigo
        ${queryAdd}
        ORDER BY  h.he_fecha ASC
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

export const getHoraExtra = getOne(HoraExtra, "he_codigo");
export const createHoraExtra = create(HoraExtra);
export const updateHoraExtra = update(HoraExtra, "he_codigo");
export const deleteHoraExtra = remove(HoraExtra, "he_codigo");
