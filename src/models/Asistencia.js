import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "../models/User.js";
import { Empresa } from "./Empresa.js";

export const Asistencia = sequelize.define("asistencias", {
  asis_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  asis_fecha_inicial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asis_fecha_final: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asis_registros: {
    type: DataTypes.JSONB,
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
});

Asistencia.sync({ alter: false });
