import { Caja } from "../models/Caja.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getCajasWithSearch = getAllWithSearch(
  "cajas",
  ["p.caja_descripcion", "p.caja_turno"],
  "p.caja_fecha_inicial",
  Caja
);

export const getCajas = getAll(Caja);
export const getCaja = getOne(Caja, "caja_codigo");
export const createCaja = create(Caja);
export const updateCaja = update(Caja, "caja_codigo");
export const deleteCaja = remove(Caja, "caja_codigo");
