import { Servicio } from "../models/Servicio.js";
import { getAll, getOne, create, update, remove } from '../utils/crudController.js';

export const getServicios = getAll(Servicio);
export const getServicio = getOne(Servicio);
export const createServicio = create(Servicio);
export const updateServicio = update(Servicio);
export const deleteServicio = remove(Servicio);