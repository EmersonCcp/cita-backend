import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cuota } from "../models/Cuota.js";
import { getOne, create, update, remove } from "../utils/crudController.js";

export const getCuotas = async (req, res) => {
  try {
    const { ventaId } = req.params;

    let sql = `
        select * from cuotas c where c.fk_venta = ${ventaId}
      `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
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
