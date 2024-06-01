import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cita } from "./Cita.js";
import { Servicio } from "./Servicio.js";

export const CitaServicio = sequelize.define("citas_servicios", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  citaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cita,
      key: "id",
    },
    onDelete: "RESTRICT",
  },
  servicioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Servicio,
      key: "id",
    },
    onDelete: "RESTRICT",
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

CitaServicio.sync({ force: false });
