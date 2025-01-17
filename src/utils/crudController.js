import { errorHandler } from "./errorHandler.js";
import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { client } from "../index.js";
import { deleteKeysByPattern } from "../middleware/redisMiddleware.js";

export const getAll = (Model) => async (req, res) => {
  try {
    const { fk_empresa } = req.params;

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
  (tableName, searchableFields, orderBy, Model) => async (req, res) => {
    try {
      const { limit, pagination, query, fk_empresa } = req.params;

      // Validar conexión a Redis
      if (!client.isOpen) {
        await client.connect();
      }

      console.log({ model: Model.name });

      // Generar una clave única para Redis
      const redisKey = `${Model.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

      console.log({ redisKey });

      // Intentar obtener los datos desde Redis
      if (Model.name !== "productos") {
        const reply = await client.get(redisKey);
        if (reply) {
          return res.status(200).json({ ok: true, items: JSON.parse(reply) });
        }
      }

      // Construir la consulta SQL
      let queryAdd = `WHERE fk_empresa = ${fk_empresa} `; // Filtra por fk_empresa
      if (query !== ":query") {
        const conditions = searchableFields
          .map((field) => `${field}::VARCHAR ILIKE '%${query}%'`)
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

      // Consultar la base de datos
      const items = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });

      if (items.length > 0 && Model.name !== "productos") {
        await client.set(redisKey, JSON.stringify(items), "EX", 3600);
      }

      // Responder con los resultados
      res.status(200).json({ ok: true, items });
    } catch (error) {
      console.error("Error in getAllWithSearch:", error);
      res.status(500).json({ ok: false, message: error.message });
    }
  };

export const getOne = (Model, idField) => async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;

    // Validar conexión a Redis
    if (!client.isOpen) {
      await client.connect();
    }

    // Prefijo para Redis
    const redisKey = `${Model.name}:${id}`;

    if (Model.name !== "productos") {
      // Intentar obtener datos desde Redis
      const reply = await client.get(redisKey);
      if (reply) {
        try {
          const parsedReply = JSON.parse(reply);
          return res.json({ ok: true, item: parsedReply });
        } catch (parseError) {
          console.error("Error parsing Redis reply:", parseError);
        }
      }
    }

    // Consultar en la base de datos
    const item = await Model.findOne({
      where: { [idField]: id, fk_empresa },
    });
    if (!item) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (Model.name !== "productos") {
      // Guardar en Redis con un TTL de 1 hora
      await client.set(redisKey, JSON.stringify(item), "EX", 3600);
    }

    // Responder con el resultado
    res.json({ ok: true, item });
  } catch (error) {
    console.error("Error in getOne:", error);
    errorHandler(res, error);
  }
};

export const create = (Model) => async (req, res) => {
  try {
    const { fk_empresa } = req.params; // O extraer desde req.body si es parte de los datos

    // Crear el registro en la base de datos
    const item = await Model.create({ ...req.body, fk_empresa });

    await deleteKeysByPattern(`${Model.name}:list:fk_empresa=${fk_empresa}:`);

    // Guardar el nuevo registro en Redis
    const redisKey = `${Model.name}:${item.id}`; // Clave basada en el modelo y el ID
    await client.set(redisKey, JSON.stringify(item), "EX", 3600);

    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const update = (Model, idField) => async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;

    // Actualizar el registro en la base de datos
    const [updated] = await Model.update(req.body, {
      where: { [idField]: id, fk_empresa }, // Filtro por empresa y ID
    });

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Obtener el registro actualizado
    const item = await Model.findOne({
      where: { [idField]: id, fk_empresa },
    });

    await deleteKeysByPattern(`${Model.name}:list:fk_empresa=${fk_empresa}:`);

    // Actualizar la caché en Redis
    const redisKey = `${Model.name}:${id}`; // Clave basada en el modelo y el ID
    await client.set(redisKey, JSON.stringify(item), "EX", 3600);

    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const remove = (Model, idField) => async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;

    // Intentar eliminar el registro de la base de datos
    const deleted = await Model.destroy({
      where: { [idField]: id, fk_empresa }, // Filtro por empresa y ID
    });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    await deleteKeysByPattern(`${Model.name}:list:fk_empresa=${fk_empresa}:`);

    // Eliminar la clave correspondiente en Redis
    const redisKey = `${Model.name}:${id}`; // Clave basada en el modelo y el ID
    await client.del(redisKey);

    res.json({ ok: true, message: "Record deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
