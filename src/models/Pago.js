import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Funcionario } from "./Funcionario.js";

export const Pago = sequelize.define("pagos", {
  //pago de salarios a funcionarios
  pago_codigo: {
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

  pago_monto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },

  pago_fecha: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Pago.sync({ alter: false });
