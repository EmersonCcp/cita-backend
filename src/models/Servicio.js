import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Servicio = sequelize.define("servicios", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    servicio: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

Servicio.sync({ force: false });