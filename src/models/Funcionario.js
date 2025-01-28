import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";

export const Funcionario = sequelize.define("funcionarios", {
  fun_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  fun_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  fun_apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_documento: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_fecha_nacimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_fecha_cobro: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_fecha_ingreso: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_check_asistencia: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },

  fun_salario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },

  fun_direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_email: {
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
});

Funcionario.sync({ alter: false });
