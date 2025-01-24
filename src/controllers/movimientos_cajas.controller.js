import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { MovimientoCaja } from "../models/MovimientoCaja.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { Empresa } from "../models/Empresa.js";

const searchableFields = [
  "p.mc_tipo",
  "p.mc_monto",
  "p.mc_descripcion",
  "p.mc_fecha",
];

// export const getEntities = getAllWithSearch(
//   "movimientos_cajas",
//   searchableFields,
//   "p.mc_fecha",
//   MovimientoCaja
// );

export const getEntities = async (req, res) => {
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

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "mc.mc_tipo",
        "mc.mc_monto",
        "mc.mc_descripcion",
        "mc.mc_fecha",
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
        ? `AND mc.fk_empresa = :fk_empresa`
        : `WHERE mc.fk_empresa = :fk_empresa`;
    }

    let sql = `
      SELECT 
      mc.mc_codigo,
      mc.mc_tipo,
      mc.mc_monto,
      mc.mc_descripcion,
      mc.mc_fecha,
      CONCAT('COD:', p.caja_codigo, ' - ', p.caja_descripcion, ' (', p.caja_turno, ')') AS caja_descripcion
    FROM 
      movimientos_cajas mc
    JOIN 
    cajas p ON p.caja_codigo = mc.fk_caja 
      ${queryAdd} ${empresaCondition}
      ORDER BY mc.mc_fecha DESC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Se usa para pasar el valor de fk_empresa
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getEntity = getOne(MovimientoCaja, "mc_codigo");
export const createEntity = create(MovimientoCaja);
export const updateEntity = update(MovimientoCaja, "mc_codigo");
export const deleteEntity = remove(MovimientoCaja, "mc_codigo");
