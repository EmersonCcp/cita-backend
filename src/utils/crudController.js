import { errorHandler } from "./errorHandler.js";
import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.findAll({ limit: 10 });
    res.json({ ok: true, items });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllWithSearch =
  (tableName, searchableFields, orderBy) => async (req, res) => {
    try {
      const { limit, pagination, query } = req.params;

      let queryAdd = ``;
      if (query !== ":query") {
        const conditions = searchableFields
          .map((field) => {
            return `${field}::VARCHAR ILIKE '%${query}%'`;
          })
          .join(" OR ");

        queryAdd = `WHERE (${conditions})`;
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
    const { id } = req.params;
    const item = await Model.findOne({ where: { [idField]: id } });
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
    const item = await Model.create(req.body);
    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const update = (Model, idField) => async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Model.update(req.body, {
      where: { [idField]: id },
    });
    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }
    const item = await Model.findOne({ where: { [idField]: id } });
    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const remove = (Model, idField) => async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const deleted = await Model.destroy({ where: { [idField]: id } });
    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    errorHandler(res, error);
  }
};
