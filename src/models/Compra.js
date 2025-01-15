import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Proveedor } from "../models/Proveedor.js";
import { Empresa } from "./Empresa.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const Compra = sequelize.define(
  "compras",
  {
    com_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    com_precio_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    com_fecha_compra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fk_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Proveedor,
        key: "prov_codigo",
      },
      onDelete: "RESTRICT",
    },
    com_factura: {
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
    // Campo para el estado de entrega con "cancelado"
    com_estado_entrega: {
      type: DataTypes.ENUM("pendiente", "proceso", "entregado", "cancelado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    // Campo para la fecha de entrega
    com_fecha_entrega: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    com_num_cuotas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    com_fecha_vencimiento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    com_tipo_pago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    timestamps: false,
  }
);

Compra.sync({ alter: false });
