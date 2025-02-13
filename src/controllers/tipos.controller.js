import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Tipo } from "../models/Tipo.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getEntitiesWithSearch = getAllWithSearch(
  "tipos",
  ["p.tip_nombre"],
  "p.tip_nombre",
  Tipo
);

export const getEntities = async (req, res) => {
  try {
    const { limit = 10, pagination = 0, query, fk_empresa, sigla } = req.params;
    console.log(limit, pagination, query, sigla);

    let conditions = [];
    let replacements = {};

    if (fk_empresa) {
      conditions.push("t.fk_empresa = :fk_empresa");
      replacements.fk_empresa = fk_empresa;
    }

    if (sigla) {
      conditions.push("t.tip_sigla = :sigla");
      replacements.sigla = sigla;
    }

    let whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let sql = `
      SELECT 
        t.tip_codigo,
        t.tip_nombre,
        t.tip_sigla
      FROM 
        tipos t
      ${whereClause}
      ORDER BY t.tip_nombre ASC
      LIMIT :limit
      OFFSET :pagination
    `;

    replacements.limit = parseInt(limit, 10);
    replacements.pagination = parseInt(pagination, 10);

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements,
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    console.error(error);
    res.status(200).json({ ok: false, message: error.message });
  }
};

// export const getEntities = getAll(Tipo);
export const getEntity = getOne(Tipo, "tip_codigo");
export const createEntity = create(Tipo);
export const updateEntity = update(Tipo, "tip_codigo");
export const deleteEntity = remove(Tipo, "tip_codigo");
