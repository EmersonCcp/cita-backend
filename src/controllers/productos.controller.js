import { Producto } from "../models/Producto.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";

const searchableFields = [
  "p.prod_nombre",
  "p.prod_precio_compra",
  "p.prod_precio_venta",
  "p.prod_cantidad",
];

export const getProductos = getAllWithSearch(
  "productos",
  searchableFields,
  "p.prod_nombre"
);
export const getProducto = getOne(Producto, "prod_codigo");
export const createProducto = create(Producto);
export const updateProducto = update(Producto, "prod_codigo");
export const deleteProducto = remove(Producto, "prod_codigo");
