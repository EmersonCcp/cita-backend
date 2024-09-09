import { CitaServicio } from "../models/CitaServicio.js";
import { sequelize } from "../database/database.js";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getAllCitasServicios = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await sequelize.query(
      `
      SELECT cs.cs_codigo, cs.fk_cita, cs.fk_servicio, cs.cs_monto, s.ser_nombre 
      FROM citas_servicios cs
      INNER JOIN servicios s ON cs.fk_servicio = s.ser_codigo
      WHERE cs.fk_cita = ${id};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// export const deleteAllById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const items = await sequelize.query(
//       `
//       DELETE FROM citas_servicios
//       WHERE fk_cita = ${id};
//       `,
//       { type: sequelize.QueryTypes.SELECT }
//     );
//     res.json({ ok: true });
//   } catch (error) {
//     res.status(500).json({ ok: false, message: error.message });
//   }
// };

export const getCitasServicios = getAll(CitaServicio);
export const getCitaServicio = getOne(CitaServicio, "cs_codigo");
export const createCitaServicio = create(CitaServicio);
export const updateCitaServicio = update(CitaServicio, "cs_codigo");
export const deleteCitaServicio = remove(CitaServicio, "cs_codigo");
