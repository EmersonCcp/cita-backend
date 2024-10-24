import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Funcionario } from "./Funcionario.js";
import { Empresa } from "./Empresa.js";

export const HoraExtra = sequelize.define("horas_extra", {
  //hora extra para los funcionarios
  he_codigo: {
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

  he_fecha: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  he_horas: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },

  he_pago_hora: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  he_monto: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  he_descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  he_estado: {
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

HoraExtra.sync({ force: false });
