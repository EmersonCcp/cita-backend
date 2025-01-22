import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Venta } from "./Venta.js";
import { Empresa } from "./Empresa.js";

export const Cobro = sequelize.define("cobros", {
  cob_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  cob_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  cob_monto_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  cob_estado: {
    type: DataTypes.ENUM("pendiente", "pagado", "cancelado"),
    allowNull: false,
    defaultValue: "pendiente",
  },

  cob_num_cuotas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  fk_venta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Venta,
      key: "ven_codigo",
    },
    onDelete: "CASCADE",
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

Cobro.sync({ alter: false });
