import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cuota } from "../models/Cuota.js";
import { Caja } from "../models/Caja.js";
import { MovimientoCaja } from "../models/MovimientoCaja.js";
import { getOne, create, update, remove } from "../utils/crudController.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getCuotas = async (req, res) => {
  try {
    const { fk_operacion, tipo_operacion, fk_empresa } = req.params; // Asegúrate de obtener fk_empresa

    let sql = `
      SELECT * 
      FROM cuotas c 
      WHERE c.fk_operacion = :fk_operacion AND c.cuo_tipo_operacion = :tipo_operacion AND c.fk_empresa = :fk_empresa
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_operacion, tipo_operacion, fk_empresa }, // Pasar los valores de ventaId y fk_empresa
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCuota = getOne(Cuota, "cuo_codigo");
// export const createCuota = create(Cuota);
export const updateCuota = update(Cuota, "cuo_codigo");
export const deleteCuota = remove(Cuota, "cuo_codigo");

export const createCuota = async (req, res) => {
  const transaction = await sequelize.transaction(); // Inicia una transacción
  try {
    const { fk_empresa } = req.params;
    const { fk_caja } = req.body;

    // Crear el registro en la base de datos dentro de la transacción
    const item = await Cuota.create(
      { ...req.body, fk_empresa },
      { transaction }
    );

    if (!item) {
      await transaction.rollback(); // Revertir cambios si ocurre un error
      return res
        .status(200)
        .json({ ok: false, message: "Error al crear el registro." });
    }

    const movimientoCajaObj = {
      mc_fecha: item.cuo_fecha_pago,
      mc_monto: item.cuo_monto,
      mc_tipo:
        (item.cuo_tipo_operacion == "venta") |
        (item.cuo_tipo_operacion == "cita")
          ? "ingreso"
          : "egreso",
      fk_caja,
      fk_empresa,
      mc_descripcion: `${item.cuo_tipo_operacion}COD${item.fk_operacion}-Cuota ${item.cuo_numero}`,
      fk_operacion: item.fk_operacion,
      mc_tipo_operacion: item.cuo_tipo_operacion,
    };

    const movimientoCaja = await MovimientoCaja.create(
      { ...movimientoCajaObj },
      { transaction }
    );

    if (!movimientoCaja) {
      await transaction.rollback(); // Revertir cambios si ocurre un error
      return res
        .status(200)
        .json({ ok: false, message: "Error al crear el registro." });
    }

    const caja = await Caja.findOne({
      where: { caja_codigo: fk_caja, fk_empresa },
      transaction,
    });

    if (!caja) {
      await transaction.rollback(); // Revertir cambios si ocurre un error
      return res
        .status(200)
        .json({ ok: false, message: "Error al obtener el registro." });
    }

    // Calculamos el nuevo saldo
    const saldoActual = Number(caja.caja_saldo_actual || 0);
    if (
      item.cuo_tipo_operacion === "compra" ||
      item.cuo_tipo_operacion === "gasto"
    ) {
      caja.caja_saldo_actual = saldoActual - Number(item.cuo_monto);
    } else {
      caja.caja_saldo_actual = saldoActual + Number(item.cuo_monto);
    }

    // Guardamos el cambio asegurándonos de incluir la transacción
    await caja.save({ transaction });

    await transaction.commit(); // Confirmar los cambios si todo es exitoso
    res.json({ ok: true, item });
  } catch (error) {
    await transaction.rollback(); // Revertir los cambios en caso de error
    errorHandler(res, error);
  }
};
