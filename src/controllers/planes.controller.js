import { Plan } from "../models/Plan.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

const searchableFields = [
  "p.plan_nombre",
  "p.plan_descripcion",
  "p.plan_precio",
];

export const getPlanes = getAllWithSearch(
  "planes",
  searchableFields,
  "p.plan_nombre"
);
export const getPlan = getOne(Plan, "plan_codigo");
export const createPlan = create(Plan);
export const updatePlan = update(Plan, "plan_codigo");
export const deletePlan = remove(Plan, "plan_codigo");
