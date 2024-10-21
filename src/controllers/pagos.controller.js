import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Pago } from "../models/Pago.js";
import { getOne, create, update, remove } from "../utils/crudController.js";

const searchableFields = ["v.pago_monto", "v.pago_fecha", "f.funcionario"];

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
          v.pago_codigo,
          f.fun_codigo AS fk_funcionario,
          CONCAT(f.fun_nombre, ' ', f.fun_apellido) AS funcionario,
          v.pago_fecha AS fecha,
          v.pago_monto AS monto
        FROM  pagos v
        INNER JOIN funcionarios f ON v.fk_funcionario = f.fun_codigo
        ${queryAdd}
        ORDER BY  v.pago_fecha ASC
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

export const getPago = getOne(Pago, "pago_codigo");
export const createPago = create(Pago);
export const updatePago = update(Pago, "pago_codigo");
export const deletePago = remove(Pago, "pago_codigo");
