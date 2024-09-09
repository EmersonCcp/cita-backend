import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Vendedor = sequelize.define("vendedores", {
  vend_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  vend_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  vend_apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vend_telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vend_documento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vend_ruc: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vend_sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vend_fecha_nacimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vend_direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vend_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Vendedor.sync({ force: false });
