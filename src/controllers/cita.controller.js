import { Cita } from "../models/Cita.js";
import { sequelize } from '../database/database.js';
import { getAll, getOne, create, update, remove } from '../utils/crudController.js';

export const getAllCitas = async (req, res) => {
    try {
      const items = await sequelize.query(`
        SELECT 
          citas.id AS id,
          clientes.id as clienteId,
          CONCAT(clientes.nombre, ' ', clientes.apellido) AS "nombreCompleto",
          citas.fecha,
          citas.hora,
          citas.estado,
          citas.monto
        FROM citas
        INNER JOIN clientes ON citas."clienteId" = clientes.id
      `, { type: sequelize.QueryTypes.SELECT });
  
      res.json({ok: true,items});
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
};

export const updateEstado = async (req, res) => {
  try {
    let {id, estado} = req.params;

    estado = estado.toLowerCase();

    if (!['pendiente', 'completado', 'cancelado'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const [updatedRows] = await Cita.update(
      { estado },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCitas = getAll(Cita);
export const getCita = getOne(Cita);
export const createCita = create(Cita);
export const updateCita = update(Cita);
export const deleteCita = remove(Cita);