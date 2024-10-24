import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cobro } from "../models/Cobro.js";
import { getOne, create, update, remove } from "../utils/crudController.js";

export const getCobrosWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params; // Asegúrate de obtener fk_empresa

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "c2.cli_apellido",
        "c2.cli_nombre",
        "c.cob_monto_total",
        "c.cob_estado",
        "c.cob_fecha",
      ];
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
        ? `AND v.fk_empresa = :fk_empresa` // Si ya hay condiciones, agrega con AND
        : `WHERE v.fk_empresa = :fk_empresa`; // Si no hay condiciones, usa WHERE
    }

    let sql = `
      SELECT 
          c.cob_codigo, 
          c.cob_fecha, 
          c.cob_monto_total, 
          c.cob_estado, 
          c.cob_num_cuotas, 
          c.fk_venta,
          CONCAT(c2.cli_nombre, ' ', c2.cli_apellido) AS cliente
      FROM 
          cobros c
      JOIN 
          ventas v ON c.fk_venta = v.ven_codigo
      JOIN 
          clientes c2 ON v.fk_cliente = c2.cli_codigo 
      ${queryAdd} ${empresaCondition}
      ORDER BY c.cob_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Pasar el valor de fk_empresa a la consulta
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCobro = getOne(Cobro, "cob_codigo");
export const createCobro = create(Cobro);
export const updateCobro = update(Cobro, "cob_codigo");
export const deleteCobro = remove(Cobro, "cob_codigo");
