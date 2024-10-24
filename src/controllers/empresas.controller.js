import { Empresa } from "../models/Empresa.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

const searchableFields = ["p.emp_nombre", "p.emp_descripcion", "p.emp_pais"];

export const getEmpresas = getAllWithSearch(
  "empresas",
  searchableFields,
  "p.emp_nombre"
);
export const getEmpresa = getOne(Empresa, "emp_codigo");
export const createEmpresa = create(Empresa);
export const updateEmpresa = update(Empresa, "emp_codigo");
export const deleteEmpresa = remove(Empresa, "emp_codigo");
