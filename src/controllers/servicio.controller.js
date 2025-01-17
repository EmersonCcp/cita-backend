import { Servicio } from "../models/Servicio.js";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  getAllWithSearch,
} from "../utils/crudController.js";

export const getServiciosWithSearch = getAllWithSearch(
  "servicios",
  ["p.ser_nombre", "p.ser_precio"],
  "p.ser_nombre",
  Servicio
);

export const getServicios = getAll(Servicio);
export const getServicio = getOne(Servicio, "ser_codigo");
export const createServicio = create(Servicio);
export const updateServicio = update(Servicio, "ser_codigo");
export const deleteServicio = remove(Servicio, "ser_codigo");
