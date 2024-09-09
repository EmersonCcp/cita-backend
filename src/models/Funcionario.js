import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

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

  fun_direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fun_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Funcionario.sync({ force: false });
