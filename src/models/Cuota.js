import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Venta } from "../models/Venta.js";
import { Empresa } from "./Empresa.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const Cuota = sequelize.define(
  "cuotas",
  {
    cuo_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fk_operacion: {
      // ID de la operación (venta o compra)
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cuo_tipo_operacion: {
      // Tipo de operación: "venta" o "compra"
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuo_numero: {
      //numero de cuota: 1,2,3
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cuo_fecha_vencimiento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuo_fecha_pago: {
      //fecha en que se pago
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuo_monto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cuo_estado: {
      //pendiente, pagado
      type: DataTypes.STRING,
      allowNull: false,
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
    timestamps: false,
  }
);

Cuota.sync({ alter: false });
