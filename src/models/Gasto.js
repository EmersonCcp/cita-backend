import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Tipo } from "../models/Tipo.js";
import { Proveedor } from "../models/Proveedor.js";
import { Empresa } from "./Empresa.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const Gasto = sequelize.define(
  "gastos",
  {
    gas_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gas_nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gas_descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gas_factura: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gas_precio_total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    gas_fecha: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gas_num_cuotas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    gas_fecha_vencimiento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gas_tipo_pago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fk_tipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Tipo,
        key: "tip_codigo",
      },
      // onDelete: "CASCADE",
    },
    fk_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Proveedor,
        key: "prov_codigo",
      },
      // onDelete: "CASCADE",
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
  },
  {
    timestamps: true,
  }
);

Gasto.sync({ force: false });
