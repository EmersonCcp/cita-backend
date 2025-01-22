import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Funcionario } from "./Funcionario.js";
import { Empresa } from "./Empresa.js";

export const Vale = sequelize.define("vale", {
  //vale para los funcionarios
  vale_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  fk_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcionario,
      key: "fun_codigo",
    },
    onDelete: "RESTRICT",
  },

  vale_monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },

  vale_fecha: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vale_descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  vale_estado: {
    type: DataTypes.ENUM("pendiente", "completado", "cancelado"),
    allowNull: false,
    defaultValue: "pendiente",
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

Vale.sync({ alter: false });
