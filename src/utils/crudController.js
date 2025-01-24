import { errorHandler } from "./errorHandler.js";
import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "../models/Empresa.js";
import { client } from "../index.js";
import { deleteKeysByPattern } from "../middleware/redisMiddleware.js";

export const getAll = (Model) => async (req, res) => {
  try {
    const { fk_empresa } = req.params;

    const empresa = await Empresa.findOne({
      where: { emp_codigo: fk_empresa },
    });

    const clienteEmpresa = empresa.get();

    if (clienteEmpresa.emp_estado === false) {
      res.status(500).json({ ok: false, error: "Cuenta Desabilitada" });
    }

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
  (tableName, searchableFields, orderBy, Model, hasFkEmpresa = true) =>
  async (req, res) => {
    try {
      const { limit, pagination, query, fk_empresa } = req.params;

      if (hasFkEmpresa) {
        const empresa = await Empresa.findOne({
          where: { emp_codigo: fk_empresa },
        });

        const clienteEmpresa = empresa.get();

        if (clienteEmpresa.emp_estado === false) {
          return res
            .status(200)
            .json({ ok: false, message: "Cuenta Desabilitada" });
        }
      }

      if (!client.isOpen) {
        await client.connect();
      }

      const redisKey = `${Model.name}:list:${
        hasFkEmpresa ? `fk_empresa=${fk_empresa}:` : ""
      }query=${query}:limit=${limit}:pagination=${pagination}`;

      if (
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        const reply = await client.get(redisKey);
        if (reply) {
          return res.status(200).json({ ok: true, items: JSON.parse(reply) });
        }
      }

      let queryAdd = hasFkEmpresa ? `WHERE fk_empresa = ${fk_empresa} ` : "";

      if (query !== ":query") {
        const conditions = searchableFields
          .map((field) => `${field}::VARCHAR ILIKE '%${query}%'`)
          .join(" OR ");
        queryAdd += `${hasFkEmpresa ? "AND" : "WHERE"} (${conditions})`;
      }

      const sql = `
      SELECT * FROM ${tableName} p
      ${queryAdd}
      ORDER BY ${orderBy} ASC
      LIMIT ${limit}
      OFFSET ${pagination}
      `;

      const items = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });

      if (
        items.length > 0 &&
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        await client.set(redisKey, JSON.stringify(items), "EX", 3600);
      }

      res.status(200).json({ ok: true, items });
    } catch (error) {
      console.error("Error in getAllWithSearch:", error);
      res.status(500).json({ ok: false, message: error.message });
    }
  };

export const getOne =
  (Model, idField, hasFkEmpresa = true) =>
  async (req, res) => {
    try {
      const { id, fk_empresa } = req.params;

      if (hasFkEmpresa) {
        const empresa = await Empresa.findOne({
          where: { emp_codigo: fk_empresa },
        });

        const clienteEmpresa = empresa.get();

        if (clienteEmpresa.emp_estado === false) {
          return res
            .status(200)
            .json({ ok: false, message: "Cuenta Desabilitada" });
        }
      }

      if (!client.isOpen) {
        await client.connect();
      }

      const redisKey = `${Model.name}:${id}`;

      if (
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        const reply = await client.get(redisKey);
        if (reply) {
          try {
            return res.json({ ok: true, item: JSON.parse(reply) });
          } catch (parseError) {
            console.error("Error parsing Redis reply:", parseError);
          }
        }
      }

      const where = hasFkEmpresa
        ? { [idField]: id, fk_empresa }
        : { [idField]: id };

      const item = await Model.findOne({ where });

      if (!item) {
        return res.status(404).json({ message: "Record not found" });
      }

      if (
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        await client.set(redisKey, JSON.stringify(item), "EX", 3600);
      }

      res.json({ ok: true, item });
    } catch (error) {
      console.error("Error in getOne:", error);
      errorHandler(res, error);
    }
  };

export const create =
  (Model, hasFkEmpresa = true) =>
  async (req, res) => {
    try {
      const { fk_empresa } = req.params;

      if (hasFkEmpresa) {
        const empresa = await Empresa.findOne({
          where: { emp_codigo: fk_empresa },
        });

        const clienteEmpresa = empresa.get();

        if (clienteEmpresa.emp_estado === false) {
          return res
            .status(200)
            .json({ ok: false, message: "Cuenta Desabilitada" });
        }
      }

      const data = hasFkEmpresa ? { ...req.body, fk_empresa } : { ...req.body };

      const item = await Model.create(data);

      if (!item) {
        return res
          .status(200)
          .json({ ok: false, message: "Error al crear el registro." });
      }

      if (hasFkEmpresa) {
        await deleteKeysByPattern(
          `${Model.name}:list:fk_empresa=${fk_empresa}:`
        );
      }

      if (
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        const redisKey = `${Model.name}:${item.id}`;
        await client.set(redisKey, JSON.stringify(item), "EX", 3600);
      }

      res.json({ ok: true, item });
    } catch (error) {
      errorHandler(res, error);
    }
  };

export const update =
  (Model, idField, hasFkEmpresa = true) =>
  async (req, res) => {
    try {
      const { id, fk_empresa } = req.params;

      if (hasFkEmpresa) {
        const empresa = await Empresa.findOne({
          where: { emp_codigo: fk_empresa },
        });

        const clienteEmpresa = empresa.get();

        if (clienteEmpresa.emp_estado === false) {
          return res
            .status(200)
            .json({ ok: false, message: "Cuenta Desabilitada" });
        }
      }

      const where = hasFkEmpresa
        ? { [idField]: id, fk_empresa }
        : { [idField]: id };

      const [updated] = await Model.update(req.body, { where });

      if (!updated) {
        return res
          .status(404)
          .json({ ok: false, message: "Error al actualizar el registro." });
      }

      const item = await Model.findOne({ where });

      if (hasFkEmpresa) {
        await deleteKeysByPattern(
          `${Model.name}:list:fk_empresa=${fk_empresa}:`
        );
      }

      if (
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        const redisKey = `${Model.name}:${id}`;
        await client.set(redisKey, JSON.stringify(item), "EX", 3600);
      }

      res.json({ ok: true, item });
    } catch (error) {
      errorHandler(res, error);
    }
  };

export const remove =
  (Model, idField, hasFkEmpresa = true) =>
  async (req, res) => {
    try {
      const { id, fk_empresa } = req.params;

      const where = hasFkEmpresa
        ? { [idField]: id, fk_empresa }
        : { [idField]: id };

      const deleted = await Model.destroy({ where });

      if (!deleted) {
        return res
          .status(404)
          .json({ ok: false, message: "Error al eliminar el registro" });
      }

      if (hasFkEmpresa) {
        await deleteKeysByPattern(
          `${Model.name}:list:fk_empresa=${fk_empresa}:`
        );
      }

      if (
        Model.name !== "productos" &&
        Model.name !== "cajas" &&
        Model.name !== "movimientos_cajas" &&
        Model.name !== "empresas"
      ) {
        const redisKey = `${Model.name}:${id}`;
        await client.del(redisKey);
      }

      res.json({ ok: true, message: "Record deleted successfully" });
    } catch (error) {
      errorHandler(res, error);
    }
  };
