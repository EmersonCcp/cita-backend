// models/Cita.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cliente } from "./Cliente.js";
import { Funcionario } from "./Funcionario.js";

export const Cita = sequelize.define("citas", {
  cita_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fk_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: "cli_codigo",
    },
    onDelete: "CASCADE",
  },
  fk_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcionario,
      key: "fun_codigo",
    },
    onDelete: "RESTRICT",
  },
  cita_monto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cita_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cita_hora: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cita_estado: {
    type: DataTypes.ENUM("pendiente", "completado", "cancelado"),
    allowNull: false,
    defaultValue: "pendiente",
  },
  cita_obs: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Cita.sync({ alter: false });
