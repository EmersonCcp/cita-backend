import { Cliente } from "../models/Cliente.js";
import { getAll, getOne, create, update, remove } from '../utils/crudController.js';

export const getClientes = getAll(Cliente);
export const getCliente = getOne(Cliente);
export const createCliente = create(Cliente);
export const updateCliente = update(Cliente);
export const deleteCliente = remove(Cliente);

