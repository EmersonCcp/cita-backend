import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";

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
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imgKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prod_cantidad: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    prod_cantidad_minima: {
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
    timestamps: true,
  }
);

Producto.sync({ force: false });
