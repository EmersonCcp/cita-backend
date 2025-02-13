import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";
import { Cliente } from "./Cliente.js";

export const Presupuesto = sequelize.define("presupuestos", {
  pres_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pres_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pres_estado: {
    type: DataTypes.STRING, //pendiente,rechazado,aceptado
    defaultValue: "pendiente",
    allowNull: false,
  },
  pres_fecha_vencimiento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pres_numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pres_obs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productos: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  fk_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: "cli_codigo",
    },
    onDelete: "RESTRICT",
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
});

Presupuesto.sync({ alter: false });
