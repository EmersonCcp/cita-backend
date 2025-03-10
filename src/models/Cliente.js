import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";

export const Cliente = sequelize.define("clientes", {
  cli_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  cli_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  cli_apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cli_telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cli_documento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cli_ruc: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cli_sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cli_fecha_nacimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cli_direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cli_email: {
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

Cliente.sync({ force: false });
