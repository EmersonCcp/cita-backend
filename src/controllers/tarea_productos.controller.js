import { TareaProducto } from "../models/TareaProducto.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getEntitiesWithSearch = getAllWithSearch(
  "tareas_producto",
  ["p.asis_fecha"],
  "p.asis_fecha",
  TareaProducto
);

export const getEntities = getAll(TareaProducto);
export const getEntity = getOne(TareaProducto, "tp_codigo");
export const createEntity = create(TareaProducto);
export const updateEntity = update(TareaProducto, "tp_codigo");
export const deleteEntity = remove(TareaProducto, "tp_codigo");
