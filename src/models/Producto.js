import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const Producto = sequelize.define(
  "productos",
  {
    prod_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prod_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prod_descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prod_cantidad: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    prod_precio_compra: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    prod_precio_venta: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Producto.sync({ alter: false });
