import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Compra } from "./Compra.js";
import { Producto } from "./Producto.js";
import { Empresa } from "./Empresa.js";

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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dc_precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fk_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empresa,
        key: "emp_codigo",
      },
      onDelete: "RESTRICT",
    },
  },
  {
    timestamps: false,
  }
);

DetalleCompra.sync({ alter: false });
