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

const searchableFields = ["clientes.cli_nombre", "clientes.cli_apellido"];

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
          citas.cita_codigo AS cita_codigo,
          clientes.cli_codigo AS fk_cliente,
          CONCAT(clientes.cli_nombre, ' ', clientes.cli_apellido) AS cliente,
          citas.cita_fecha AS fecha,
          citas.cita_hora AS hora,
          citas.cita_estado AS estado,
          citas.cita_monto AS monto
        FROM  citas
        INNER JOIN clientes ON citas.fk_cliente = clientes.cli_codigo
        ${queryAdd}
        ORDER BY  citas.cita_fecha ASC
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
