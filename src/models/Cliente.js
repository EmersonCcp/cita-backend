import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Cliente = sequelize.define("clientes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    apellido: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    sexo: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true, // Esto asegura que el email tenga un formato de email válido
        },
    },
});

Cliente.sync({ force: false });