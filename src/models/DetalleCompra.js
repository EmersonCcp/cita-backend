import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Compra } from "./Compra.js";
import { Producto } from "./Producto.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const DetalleCompra = sequelize.define(
  "detalle_compras",
  {
    dc_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fk_compra: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Compra,
        key: "com_codigo",
      },
      onDelete: "CASCADE",
    },
    fk_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Producto,
        key: "prod_codigo",
      },
      onDelete: "RESTRICT",
    },
    dc_cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dc_precio_unitario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

DetalleCompra.sync({ force: false });
