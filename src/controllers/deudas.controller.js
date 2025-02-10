import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Deuda } from "../models/Deuda.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { client } from "../index.js";
import { Empresa } from "../models/Empresa.js";

export const getDeudasWithSearch = async (req, res) => {
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

    // const redisKey = `${Deuda.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    let queryAdd = ``;
    if (query !== ":query") {
      const searchableFields = [
        "c2.prov_nombre",
        "c.deuda_monto_total",
        "c.deuda_estado",
        "c.deuda_fecha",
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
            (c.deuda_tipo_operacion = 'compra' AND v.fk_empresa = :fk_empresa) 
            
          )`
        : `WHERE 
            (c.deuda_tipo_operacion = 'compra' AND v.fk_empresa = :fk_empresa) 
            `;
    }

    let sql = `
      SELECT 
    c.deuda_codigo, 
    c.deuda_fecha, 
    c.deuda_monto_total, 
    c.deuda_estado, 
    c.deuda_num_cuotas, 
    c.deuda_tipo_operacion,
    c.fk_operacion,
    CASE 
        WHEN c.deuda_tipo_operacion = 'compra' THEN v.com_codigo
--        WHEN c.deuda_tipo_operacion = 'gasto' THEN g.gas_codigo 
    END AS operacion_codigo,
    CASE 
        WHEN c.deuda_tipo_operacion = 'compra' THEN p.prov_nombre
--        WHEN c.deuda_tipo_operacion = 'gasto' THEN g.gas_descripcion
    END AS proveedor
FROM 
    deudas c
LEFT JOIN compras v ON c.deuda_tipo_operacion = 'compra' AND c.fk_operacion = v.com_codigo
LEFT JOIN proveedores p ON v.fk_proveedor = p.prov_codigo
--LEFT JOIN gastos g ON c.deuda_tipo_operacion = 'gasto' AND c.fk_operacion = g.gas_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY c.deuda_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Pasar el valor de fk_empresa a la consulta
    });

    // if (items.length > 0) {
    //   await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    // }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getDeuda = getOne(Deuda, "deuda_codigo");
export const createDeuda = create(Deuda);
export const updateDeuda = update(Deuda, "deuda_codigo");
export const deleteDeuda = remove(Deuda, "deuda_codigo");
