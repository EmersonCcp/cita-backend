import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cita } from "./Cita.js";
import { Servicio } from "./Servicio.js";

export const CitaServicio = sequelize.define("citas_servicios", {
  cs_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fk_cita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cita,
      key: "cita_codigo",
    },
    onDelete: "CASCADE",
  },
  fk_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Servicio,
      key: "ser_codigo",
    },
    onDelete: "RESTRICT",
  },
  cs_monto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

CitaServicio.sync({ alter: false });
