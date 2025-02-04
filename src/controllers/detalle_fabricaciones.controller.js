import { DetalleFabricacion } from "../models/DetalleFabricacion.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getEntitiesWithSearch = getAllWithSearch(
  "detalle_fabricaciones",
  ["p.asis_fecha"],
  "p.asis_fecha",
  DetalleFabricacion
);

export const getEntities = getAll(DetalleFabricacion);
export const getEntity = getOne(DetalleFabricacion, "asis_codigo");
export const createEntity = create(DetalleFabricacion);
export const updateEntity = update(DetalleFabricacion, "asis_codigo");
export const deleteEntity = remove(DetalleFabricacion, "asis_codigo");
