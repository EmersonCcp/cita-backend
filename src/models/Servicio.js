import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Servicio = sequelize.define("servicios", {
  ser_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  ser_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  ser_descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ser_precio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  ser_imgUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ser_imgKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Servicio.sync({ force: false });
