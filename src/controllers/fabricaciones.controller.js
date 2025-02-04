import { Fabricacion } from "../models/Fabricacion.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getEntitiesWithSearch = getAllWithSearch(
  "fabricaciones",
  ["p.fa_fecha_inicial"],
  "p.ven_estado",
  Fabricacion
);

export const getEntities = getAll(Fabricacion);
export const getEntity = getOne(Fabricacion, "fa_codigo");
export const createEntity = create(Fabricacion);
export const updateEntity = update(Fabricacion, "fa_codigo");
export const deleteEntity = remove(Fabricacion, "fa_codigo");
