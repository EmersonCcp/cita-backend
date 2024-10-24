import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";

export const Proveedor = sequelize.define(
  "proveedores",
  {
    prov_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prov_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prov_ruc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prov_documento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prov_telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prov_email: {
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
    timestamps: true,
  }
);

Proveedor.sync({ force: false });
