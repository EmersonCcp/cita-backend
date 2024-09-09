import { Vendedor } from "../models/Vendedor.js";
import {
  getAllWithSearch,
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

export const getVendedorsWithSearch = getAllWithSearch(
  "vendedores",
  ["p.vend_nombre", "p.vend_apellido"],
  "p.vend_nombre"
);

export const getVendedores = getAll(Vendedor);
export const getVendedor = getOne(Vendedor, "vend_codigo");
export const createVendedor = create(Vendedor);
export const updateVendedor = update(Vendedor, "vend_codigo");
export const deleteVendedor = remove(Vendedor, "vend_codigo");
