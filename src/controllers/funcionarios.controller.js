import { Empresa } from "../models/Empresa.js";
import { Funcionario } from "../models/Funcionario.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getFuncionariosWithSearch = getAllWithSearch(
  "funcionarios",
  ["p.fun_nombre", "p.fun_apellido"],
  "p.fun_nombre",
  Funcionario
);

export const getFuncionarios = getAll(Funcionario);
export const getFuncionario = getOne(Funcionario, "fun_codigo");
export const createFuncionario = create(Funcionario);
export const updateFuncionario = update(Funcionario, "fun_codigo");
export const deleteFuncionario = remove(Funcionario, "fun_codigo");
