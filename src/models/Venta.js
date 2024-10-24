import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Cliente } from "./Cliente.js";
import { Funcionario } from "./Funcionario.js";
import { Empresa } from "./Empresa.js";

export const Venta = sequelize.define("ventas", {
  ven_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  ven_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  ven_precio_total: {
    type: DataTypes.INTEGER,
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

  fk_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Funcionario,
      key: "fun_codigo",
    },
    onDelete: "RESTRICT",
  },

  ven_factura: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ven_medio_pago: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ven_estado: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ven_observaciones: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ven_observaciones: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ven_tipo_pago: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  ven_num_cuotas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  ven_fecha_vencimiento: {
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

Venta.sync({ force: false });
