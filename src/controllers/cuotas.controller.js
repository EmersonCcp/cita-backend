import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cuota } from "../models/Cuota.js";
import { getOne, create, update, remove } from "../utils/crudController.js";

export const getCuotas = async (req, res) => {
  try {
    const { ventaId, fk_empresa } = req.params; // Asegúrate de obtener fk_empresa

    let sql = `
      SELECT * 
      FROM cuotas c 
      JOIN ventas v ON c.fk_venta = v.ven_codigo
      WHERE c.fk_venta = :ventaId AND v.fk_empresa = :fk_empresa
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { ventaId, fk_empresa }, // Pasar los valores de ventaId y fk_empresa
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCuota = getOne(Cuota, "cuo_codigo");
export const createCuota = create(Cuota);
export const updateCuota = update(Cuota, "cuo_codigo");
export const deleteCuota = remove(Cuota, "cuo_codigo");
