import { QueryTypes } from "sequelize";
import { Gasto } from "../models/Gasto.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { sequelize } from "../database/database.js";
import { errorHandler } from "../utils/errorHandler.js";
import { Cobro } from "../models/Cobro.js";
import { Deuda } from "../models/Deuda.js";

const searchableFields = [
  "g.gas_nombre",
  "g.gas_fecha",
  "proveedores.pro_nombre",
  "tipos.tip_nombre",
];

export const getGasto = getOne(Gasto, "gas_codigo");
// export const createGasto = create(Gasto);
export const updateGasto = update(Gasto, "gas_codigo");
// export const deleteGasto = remove(Gasto, "gas_codigo");

export const getGastosWithSearch = async (req, res) => {
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
        ? `AND g.fk_empresa = ${fk_empresa}`
        : `WHERE g.fk_empresa = ${fk_empresa}`;
    }

    let sql = `
    SELECT 
      g.gas_codigo,
      g.gas_nombre, 
      g.gas_precio_total, 
      g.gas_fecha,
      proveedores.prov_nombre AS proveedor,
      tipos.tip_nombre as tipo
    FROM 
      gastos g
    JOIN 
      proveedores ON g.fk_proveedor = proveedores.prov_codigo
    JOIN 
      tipos ON g.fk_tipo = tipos.tip_codigo
    ${queryAdd} ${empresaCondition} 
    ORDER BY g.gas_fecha ASC
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

export const createGasto = async (req, res) => {
  const t = await sequelize.transaction();

  console.log("holaaaaa");

  try {
    console.log(req.body);

    const { item } = req.body;
    const { fk_empresa } = req.params;

    console.log("holaaaaaaaaaaaaaaaaaaa", item, fk_empresa);

    const newGasto = await Gasto.create(
      { ...req.body, fk_empresa },
      { transaction: t }
    );

    console.log({ newGasto });

    if (newGasto) {
      await Deuda.create(
        {
          deuda_estado: "pendiente",
          deuda_fecha: newGasto.gas_fecha_vencimiento,
          deuda_monto_total: newGasto.gas_precio_total,
          deuda_num_cuotas: newGasto.gas_num_cuotas,
          fk_operacion: newGasto.gas_codigo,
          deuda_tipo_operacion: "gasto",
          fk_empresa,
        },
        { transaction: t }
      );
    } else {
      await transaction.rollback();
      return res
        .status(404)
        .json({ ok: false, message: "Registro no encontrado" });
    }

    await t.commit();
    res.status(201).json({ ok: true, message: "Gasto creado con éxito" });
  } catch (error) {
    console.log(error);

    await t.rollback();
    errorHandler(res, error);
  }
};

export const deleteGasto = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, fk_empresa } = req.params;

    const existingGasto = await Gasto.findOne({
      where: { gas_codigo: id, fk_empresa },
    });

    if (!existingGasto) {
      return res
        .status(404)
        .json({ ok: false, message: "Gasto no encontrada" });
    }

    // Eliminar cuotas
    const sqlDeleteCuotas = `DELETE FROM cuotas WHERE cuo_tipo_operacion = 'gasto' AND fk_operacion = ${id}`;
    await sequelize.query(sqlDeleteCuotas, {
      type: QueryTypes.DELETE,
      transaction,
    });

    // Devolver saldo a las cajas
    const sqlDevolverStock = `WITH TotalMovimientos AS (
      SELECT 
        fk_caja, 
        SUM(mc_monto) AS total_monto
      FROM 
        movimientos_cajas
      WHERE 
        fk_operacion = ${id} 
      GROUP BY 
        fk_caja
    )
    
    UPDATE 
      cajas
    SET 
      caja_saldo_actual = caja_saldo_actual + tm.total_monto
    FROM 
      TotalMovimientos tm
    WHERE 
      cajas.caja_codigo = tm.fk_caja;`;
    await sequelize.query(sqlDevolverStock, { transaction });

    // Eliminar movimientos de caja
    const sqlMovimientoCaja = `DELETE FROM movimientos_cajas WHERE fk_operacion = ${id} AND mc_tipo_operacion = 'gasto'`;
    await sequelize.query(sqlMovimientoCaja, {
      type: QueryTypes.DELETE,
      transaction,
    });

    await Cobro.destroy({
      where: { fk_operacion: id, cob_tipo_operacion: "gasto" },
      transaction,
    });

    await Gasto.destroy({ where: { gas_codigo: id, fk_empresa }, transaction });

    await transaction.commit();
    res.json({ ok: true, message: "Gasto  eliminado correctamente" });
  } catch (error) {
    await transaction.rollback();
    errorHandler(res, error);
  }
};
