import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "../models/User.js";
import { Empresa } from "./Empresa.js";

export const Caja = sequelize.define("cajas", {
  caja_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  caja_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  caja_turno: {
    //manana, tarde, noche, dia completo
    type: DataTypes.STRING,
    allowNull: false,
  },

  caja_fecha_inicial: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  caja_fecha_final: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fk_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "RESTRICT",
  },

  caja_saldo_inicial: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },

  caja_saldo_actual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },

  caja_saldo_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },

  caja_estado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
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

Caja.sync({ force: false });
