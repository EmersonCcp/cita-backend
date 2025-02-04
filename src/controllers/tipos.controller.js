import { Tipo } from "../models/Tipo.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getEntitiesWithSearch = getAllWithSearch(
  "tipos",
  ["p.tip_nombre"],
  "p.tip_nombre",
  Tipo
);

export const getEntities = getAll(Tipo);
export const getEntity = getOne(Tipo, "tip_codigo");
export const createEntity = create(Tipo);
export const updateEntity = update(Tipo, "tip_codigo");
export const deleteEntity = remove(Tipo, "tip_codigo");
