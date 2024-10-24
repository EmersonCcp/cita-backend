import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Plan } from "../models/Plan.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const Empresa = sequelize.define("empresas", {
  emp_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  emp_nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emp_descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emp_pais: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emp_ciudad: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emp_telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emp_estado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },

  emp_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fk_plan: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Plan,
      key: "plan_codigo",
    },
    onDelete: "RESTRICT",
  },
});

Empresa.sync({ alter: false });
