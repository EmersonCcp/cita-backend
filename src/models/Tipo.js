import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";

export const Tipo = sequelize.define("tipos", {
  tip_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tip_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tip_sigla: {
    type: DataTypes.STRING,
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

Tipo.sync({ alter: false });
