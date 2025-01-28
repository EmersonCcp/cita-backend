import { Asistencia } from "../models/Asistencia.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getEntitiesWithSearch = getAllWithSearch(
  "asistencias",
  ["p.asis_fecha"],
  "p.asis_fecha",
  Asistencia
);

export const getEntities = getAll(Asistencia);
export const getEntity = getOne(Asistencia, "asis_codigo");
export const createEntity = create(Asistencia);
export const updateEntity = update(Asistencia, "asis_codigo");
export const deleteEntity = remove(Asistencia, "asis_codigo");
