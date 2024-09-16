import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cobro } from "../models/Cobro.js";
import { getOne, create, update, remove } from "../utils/crudController.js";

export const getCobrosWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query } = req.params;

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
        ${queryAdd}
        ORDER BY c.cob_fecha ASC
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
export const getCobro = getOne(Cobro, "cob_codigo");
export const createCobro = create(Cobro);
export const updateCobro = update(Cobro, "cob_codigo");
export const deleteCobro = remove(Cobro, "cob_codigo");
