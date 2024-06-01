import { CitaServicio } from "../models/CitaServicio.js";
import { sequelize } from '../database/database.js';
import { getAll, getOne, create, update, remove } from '../utils/crudController.js';

export const getAllCitasServicios = async (req, res) => {
    try {
      const {id} = req.params;
      const items = await sequelize.query(`
      SELECT cs.id, cs."citaId", cs."servicioId", cs.monto, s.servicio 
      FROM citas_servicios cs
      INNER JOIN servicios s ON cs."servicioId" = s.id
      WHERE cs."citaId" = ${id};
      `, { type: sequelize.QueryTypes.SELECT });
  
      res.json({ok: true,items});
    } catch (error) {
      res.status(500).json({ ok:false, message: error.message });
    }
};

export const deleteAllById = async (req, res) => {
    try {
      const {id} = req.params;
      const items = await sequelize.query(`
      DELETE FROM citas_servicios
      WHERE "citaId" = ${id};
      `, { type: sequelize.QueryTypes.SELECT });
      res.json({ok: true});
    } catch (error) {
      res.status(500).json({ ok:false, message: error.message });
    }
};

export const getCitasServicios = getAll(CitaServicio);
export const getCitaServicio = getOne(CitaServicio);
export const createCitaServicio = create(CitaServicio);
export const updateCitaServicio = update(CitaServicio);
export const deleteCitaServicio = remove(CitaServicio);