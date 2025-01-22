import { MovimientoCaja } from "../models/MovimientoCaja.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

const searchableFields = [
  "p.mc_tipo",
  "p.mc_monto",
  "p.mc_descripcion",
  "p.mc_fecha",
];

export const getEntities = getAllWithSearch(
  "movimientos_caja",
  searchableFields,
  "p.mc_fecha",
  MovimientoCaja
);
export const getEntity = getOne(MovimientoCaja, "mc_codigo");
export const createEntity = create(MovimientoCaja);
export const updateEntity = update(MovimientoCaja, "mc_codigo");
export const deleteEntity = remove(MovimientoCaja, "mc_codigo");
