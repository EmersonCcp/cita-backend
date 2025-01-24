import { Cita } from "../models/Cita.js";
import { sequelize } from "../database/database.js";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { QueryTypes } from "sequelize";
import { deleteKeysByPattern } from "../middleware/redisMiddleware.js";
import { client } from "../index.js";
import { Empresa } from "../models/Empresa.js";

const searchableFields = ["clientes.cli_nombre", "clientes.cli_apellido"];

export const getAllWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    if (fk_empresa) {
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

    const tableName = "citas";

    // Generar una clave única para Redis
    const redisKey = `${Cita.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    // Intentar obtener los datos desde Redis
    const reply = await client.get(redisKey);
    if (reply) {
      return res.status(200).json({ ok: true, items: JSON.parse(reply) });
    }

    let queryAdd = ``;
    if (query && query !== ":query") {
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
        ? `AND citas.fk_empresa = :fk_empresa`
        : `WHERE citas.fk_empresa = :fk_empresa`;
    }

    const sql = `
      SELECT 
        citas.cita_codigo AS cita_codigo,
        clientes.cli_codigo AS fk_cliente,
        CONCAT(clientes.cli_nombre, ' ', clientes.cli_apellido) AS cliente,
        citas.cita_fecha AS fecha,
        citas.cita_hora AS hora,
        citas.cita_estado AS estado,
        citas.cita_monto AS monto
      FROM  ${tableName}
      INNER JOIN clientes ON citas.fk_cliente = clientes.cli_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY  citas.cita_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Se usa para pasar el valor de fk_empresa
    });

    if (items.length > 0) {
      await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateEstado = async (req, res) => {
  try {
    let { id, estado } = req.params;

    estado = estado.toLowerCase();

    if (!["pendiente", "completado", "cancelado"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const [updatedRows] = await Cita.update({ estado }, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    await deleteKeysByPattern(`${Cita.name}:list:fk_empresa=`);

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCitas = getAll(Cita);
export const getCita = getOne(Cita, "cita_codigo");
export const createCita = create(Cita);
export const updateCita = update(Cita, "cita_codigo");
export const deleteCita = remove(Cita, "cita_codigo");
