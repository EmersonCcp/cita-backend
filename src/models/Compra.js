import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Proveedor } from "../models/Proveedor.js";

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
      onDelete: "CASCADE",
    },
    com_factura: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

Compra.sync({ force: false });
