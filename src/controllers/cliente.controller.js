import { Cliente } from "../models/Cliente.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getClientesWithSearch = getAllWithSearch(
  "clientes",
  ["p.cli_nombre", "p.cli_apellido"],
  "p.cli_nombre",
  Cliente
);

export const getClientes = getAll(Cliente);
export const getCliente = getOne(Cliente, "cli_codigo");
export const createCliente = create(Cliente);
export const updateCliente = update(Cliente, "cli_codigo");
export const deleteCliente = remove(Cliente, "cli_codigo");
