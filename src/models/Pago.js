import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Funcionario } from "./Funcionario.js";
import { Empresa } from "./Empresa.js";

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

Pago.sync({ force: false });
