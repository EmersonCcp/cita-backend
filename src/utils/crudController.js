import { errorHandler } from "./errorHandler.js";
import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const getAll = (Model) => async (req, res) => {
  try {
    const { fk_empresa } = req.params; // Suponiendo que lo pasas en los parámetros
    const items = await Model.findAll({
      where: { fk_empresa },
      limit: 10,
    });
    res.json({ ok: true, items });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllWithSearch =
  (tableName, searchableFields, orderBy) => async (req, res) => {
    try {
      const { limit, pagination, query, fk_empresa } = req.params;

      let queryAdd = `WHERE fk_empresa = ${fk_empresa} `; // Filtra por fk_empresa
      if (query !== ":query") {
        const conditions = searchableFields
          .map((field) => {
            return `${field}::VARCHAR ILIKE '%${query}%'`;
          })
          .join(" OR ");

        queryAdd += `AND (${conditions})`;
      }

      let sql = `
      SELECT * FROM ${tableName} p
      ${queryAdd}
      ORDER BY ${orderBy} ASC
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

export const getOne = (Model, idField) => async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;
    const item = await Model.findOne({
      where: { [idField]: id, fk_empresa },
    });
    if (!item) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const create = (Model) => async (req, res) => {
  try {
    const { fk_empresa } = req.params; // O extraer desde req.body si es parte de los datos
    const item = await Model.create({ ...req.body, fk_empresa });
    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const update = (Model, idField) => async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;
    const [updated] = await Model.update(req.body, {
      where: { [idField]: id, fk_empresa }, // Filtro por empresa y id
    });
    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }
    const item = await Model.findOne({
      where: { [idField]: id, fk_empresa },
    });
    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const remove = (Model, idField) => async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;
    const deleted = await Model.destroy({
      where: { [idField]: id, fk_empresa }, // Filtro por empresa y id
    });
    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    errorHandler(res, error);
  }
};
