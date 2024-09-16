import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// import { Proyecto } from "./Proyecto.js"; // Importa Proyecto aquí

export const Notificacion = sequelize.define("notificaciones", {
  noti_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  noti_mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  noti_rango: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  noti_visto: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Notificacion.sync({ force: false });
