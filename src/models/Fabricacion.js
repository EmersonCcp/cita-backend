import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "../models/User.js";
import { Empresa } from "./Empresa.js";
import { Cliente } from "./Cliente.js";

export const Fabricacion = sequelize.define("fabricaciones", {
  fa_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fa_fecha_inicial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fa_fecha_final: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  fa_precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  fk_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Cliente,
      key: "cli_codigo",
    },
    onDelete: "RESTRICT",
  },

  ven_estado: {
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

Fabricacion.sync({ force: false });
