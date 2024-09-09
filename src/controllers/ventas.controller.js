import { QueryTypes } from "sequelize";
import { Venta } from "../models/Venta.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { sequelize } from "../database/database.js";

// export const getVentasWithSearch = getAllWithSearch(
//   "Ventas",
//   ["p.cli_nombre", "p.cli_apellido"],
//   "p.cli_nombre"
// );

export const getVentas = async (req, res) => {
  try {
    const { limit, pagination, query } = req.params;

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "v.ven_codigo",
        "c.cli_nombre",
        "c.cli_apellido",
        "v.ven_factura",
      ];
      const conditions = searchableFields
        .map((field) => {
          return `${field}::VARCHAR ILIKE '%${query}%'`;
        })
        .join(" OR ");

      queryAdd = `WHERE (${conditions})`;
    }

    let sql = `
      select 
        v.ven_codigo,
        v.ven_precio_total,
        v.ven_fecha,
        v.ven_factura,
        concat(c.cli_nombre, ' ', c.cli_apellido) as cliente
      from 
        ventas v
      join
        clientes c on v.fk_cliente = c.cli_codigo 
      ${queryAdd}
      ORDER BY v.ven_fecha ASC
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

export const getVenta = getOne(Venta, "ven_codigo");
export const createVenta = create(Venta);
export const updateVenta = update(Venta, "ven_codigo");
export const deleteVenta = remove(Venta, "ven_codigo");
