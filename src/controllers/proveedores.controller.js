import { Proveedor } from "../models/Proveedor.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

const searchableFields = ["p.prov_nombre", "p.prov_ruc", "p.prov_documento"];

export const getProveedores = getAllWithSearch(
  "proveedores",
  searchableFields,
  "p.prov_nombre",
  Proveedor
);
export const getProveedor = getOne(Proveedor, "prov_codigo");
export const createProveedor = create(Proveedor);
export const updateProveedor = update(Proveedor, "prov_codigo");
export const deleteProveedor = remove(Proveedor, "prov_codigo");
