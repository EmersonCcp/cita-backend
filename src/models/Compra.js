import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Proveedor } from "../models/Proveedor.js";
import { Empresa } from "./Empresa.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const Compra = sequelize.define(
  "compras",
  {
    com_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    com_precio_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    com_fecha_compra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fk_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Proveedor,
        key: "prov_codigo",
      },
      onDelete: "RESTRICT",
    },
    com_factura: {
      type: DataTypes.STRING,
      allowNull: true,
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

Compra.sync({ force: false });
