// models/Cita.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cliente } from "./Cliente.js";
import { Funcionario } from "./Funcionario.js";
import { Empresa } from "./Empresa.js";
import { Caja } from "./Caja.js";

export const Cita = sequelize.define("citas", {
  cita_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fk_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: "cli_codigo",
    },
    onDelete: "RESTRICT",
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
  cita_monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cita_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cita_hora: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cita_estado: {
    type: DataTypes.ENUM("pendiente", "completado", "cancelado"),
    allowNull: false,
    defaultValue: "pendiente",
  },
  cita_obs: {
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
  // fk_caja: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: Caja,
  //     key: "caja_codigo",
  //   },
  //   onDelete: "RESTRICT", // Si se elimina la caja, también los movimientos
  // },
});

Cita.sync({ force: false });
