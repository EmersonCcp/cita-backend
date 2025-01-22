import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Plan = sequelize.define("planes", {
  plan_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  plan_nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  plan_descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  plan_precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },

  plan_duracion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  plan_estado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

Plan.sync({ alter: false });
