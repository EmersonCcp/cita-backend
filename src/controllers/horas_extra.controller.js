import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { HoraExtra } from "../models/HoraExtra.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { client } from "../index.js";

const searchableFields = [
  "h.he_monto",
  "h.he_fecha",
  "f.fun_nombre",
  "f.fun_apellido",
];

export const getAllWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    const redisKey = `${HoraExtra.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    let queryAdd = ``;
    if (query && query !== ":query") {
      const searchableFields = [
        "h.he_codigo",
        "f.fun_nombre",
        "f.fun_apellido",
        "h.he_fecha",
        "h.he_horas",
        "h.he_estado",
        "h.he_monto",
      ];
      const conditions = searchableFields
        .map((field) => {
          return `${field}::VARCHAR ILIKE '%${query}%'`;
        })
        .join(" OR ");

      queryAdd = `WHERE (${conditions})`;
    }

    // Agregar la condición para fk_empresa
    let empresaCondition = ``;
    if (fk_empresa) {
      empresaCondition = queryAdd
        ? `AND h.fk_empresa = :fk_empresa`
        : `WHERE h.fk_empresa = :fk_empresa`;
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
      FROM 
        "horas_extras" h
      INNER JOIN 
        funcionarios f ON h.fk_funcionario = f.fun_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY 
        h.he_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Usar para pasar el valor de fk_empresa
    });

    if (items.length > 0) {
      await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getHoraExtra = getOne(HoraExtra, "he_codigo");
export const createHoraExtra = create(HoraExtra);
export const updateHoraExtra = update(HoraExtra, "he_codigo");
export const deleteHoraExtra = remove(HoraExtra, "he_codigo");
