import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Presupuesto } from "../models/Presupuesto.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

// export const getEntitiesWithSearch = getAllWithSearch(
//   "presupuestos",
//   ["p.pres_fecha"],
//   "p.pres_fecha",
//   Presupuesto
// );

const searchableFields = [
  "p.pres_fecha",
  "p.pres_fecha_vencimiento",
  "p.pres_numero",
  "c.cliente",
];

export const getEntitiesWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    let queryAdd = ``;
    if (query !== ":query") {
      const conditions = searchableFields
        .map((field) => {
          return `${field}::VARCHAR ILIKE '%${query}%'`;
        })
        .join(" OR ");

      queryAdd = `WHERE (${conditions})`;
    }

    let empresaCondition = ``;
    if (fk_empresa) {
      empresaCondition = queryAdd
        ? `AND p.fk_empresa = ${fk_empresa}`
        : `WHERE p.fk_empresa = ${fk_empresa}`;
    }

    let sql = `
    SELECT 
    p.pres_codigo,
    p.pres_fecha,
    p.pres_fecha_vencimiento,
    p.pres_numero,
    CONCAT(c.cli_nombre, ' ', c.cli_apellido) AS cliente
FROM 
    presupuestos p
INNER JOIN clientes c ON p.fk_cliente = c.cli_codigo
    
    ${queryAdd} ${empresaCondition} 
    ORDER BY p.pres_fecha ASC
    LIMIT ${limit}
    OFFSET ${pagination}
  `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    console.log(error);

    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getEntities = getAll(Presupuesto);
export const getEntity = getOne(Presupuesto, "pres_codigo");
export const createEntity = create(Presupuesto);
export const updateEntity = update(Presupuesto, "pres_codigo");
export const deleteEntity = remove(Presupuesto, "pres_codigo");
