import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";
import { Venta } from "./Venta.js";
import { Fabricacion } from "./Fabricacion.js";
import { Empresa } from "./Empresa.js";

//servira para guarda datos para categoria_gasto y categoria_material

export const DetalleFabricacion = sequelize.define(
  "detalle_fabricaciones",
  {
    df_codigo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fk_fabricacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Fabricacion,
        key: "fa_codigo",
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

    df_cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    df_precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
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

DetalleFabricacion.sync({ force: false });
