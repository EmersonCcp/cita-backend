import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cobro } from "../models/Cobro.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { client } from "../index.js";
import { Empresa } from "../models/Empresa.js";

export const getCobrosWithSearch = async (req, res) => {
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

    // const redisKey = `${Cobro.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

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
        ? `AND (
            (c.cob_tipo_operacion = 'venta' AND v.fk_empresa = :fk_empresa) 
            OR 
            (c.cob_tipo_operacion = 'cita' AND ct.fk_empresa = :fk_empresa)
          )`
        : `WHERE 
            (c.cob_tipo_operacion = 'venta' AND v.fk_empresa = :fk_empresa) 
            OR 
            (c.cob_tipo_operacion = 'cita' AND ct.fk_empresa = :fk_empresa)`;
    }
    

    let sql = `
     SELECT 
    c.cob_codigo, 
    c.cob_fecha, 
    c.cob_monto_total, 
    c.cob_estado, 
    c.cob_num_cuotas, 
    c.cob_tipo_operacion,
    c.fk_operacion,
    CASE 
        WHEN c.cob_tipo_operacion = 'venta' THEN v.ven_codigo
        WHEN c.cob_tipo_operacion = 'cita' THEN ct.cita_codigo 
    END AS operacion_codigo,
    CASE 
        WHEN c.cob_tipo_operacion = 'venta' THEN CONCAT(cli.cli_nombre, ' ', cli.cli_apellido)
        WHEN c.cob_tipo_operacion = 'cita' THEN CONCAT(cli2.cli_nombre, ' ', cli2.cli_apellido)
    END AS cliente
FROM 
    cobros c
LEFT JOIN ventas v ON c.cob_tipo_operacion = 'venta' AND c.fk_operacion = v.ven_codigo
LEFT JOIN clientes cli ON v.fk_cliente = cli.cli_codigo
LEFT JOIN citas ct ON c.cob_tipo_operacion = 'cita' AND c.fk_operacion = ct.cita_codigo 
LEFT JOIN clientes cli2 ON ct.fk_cliente = cli2.cli_codigo 
      ${queryAdd} ${empresaCondition}
      ORDER BY c.cob_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    console.log(sql);
    

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Pasar el valor de fk_empresa a la consulta
    });

    console.log(items);
    

    // if (items.length > 0) {
    //   await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    // }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCobro = getOne(Cobro, "cob_codigo");
export const createCobro = create(Cobro);
export const updateCobro = update(Cobro, "cob_codigo");
export const deleteCobro = remove(Cobro, "cob_codigo");
