import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";
import { Venta } from "./Venta.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const DetalleVenta = sequelize.define(
  "detalle_ventas",
  {
    dv_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fk_venta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Venta,
        key: "ven_codigo",
      },
      onDelete: "CASCADE",
    },

    fk_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Producto,
        key: "prod_codigo",
      },
      onDelete: "RESTRICT",
    },

    dv_cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    dv_precio_unitario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

DetalleVenta.sync({ force: false });
