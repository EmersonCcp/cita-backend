import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Pago } from "../models/Pago.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { client } from "../index.js";
import { Empresa } from "../models/Empresa.js";

const searchableFields = [
  "v.pago_monto",
  "v.pago_fecha",
  "f.fun_nombre",
  "f.fun_apellido",
];

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

    const redisKey = `${Pago.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    let queryAdd = ``;
    if (query && query !== ":query") {
      const searchableFields = [
        "v.pago_codigo",
        "f.fun_nombre",
        "f.fun_apellido",
        "v.pago_fecha",
        "v.pago_monto",
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
        ? `AND v.fk_empresa = :fk_empresa`
        : `WHERE v.fk_empresa = :fk_empresa`;
    }

    const sql = `
      SELECT 
        v.pago_codigo,
        f.fun_codigo AS fk_funcionario,
        CONCAT(f.fun_nombre, ' ', f.fun_apellido) AS funcionario,
        v.pago_fecha AS fecha,
        v.pago_monto AS monto
      FROM 
        pagos v
      INNER JOIN 
        funcionarios f ON v.fk_funcionario = f.fun_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY 
        v.pago_fecha ASC
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

export const getPago = getOne(Pago, "pago_codigo");
export const createPago = create(Pago);
export const updatePago = update(Pago, "pago_codigo");
export const deletePago = remove(Pago, "pago_codigo");
