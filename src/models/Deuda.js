import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Compra } from "./Compra.js"; // Asegúrate de que tienes el modelo de Compra
import { Empresa } from "./Empresa.js"; // Si es necesario asociar una empresa

export const Deuda = sequelize.define("deudas", {
  deuda_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  deuda_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  deuda_monto_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  deuda_estado: {
    type: DataTypes.ENUM("pendiente", "pagado", "cancelado"),
    allowNull: false,
    defaultValue: "pendiente",
  },

  deuda_num_cuotas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  fk_compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Compra,
      key: "com_codigo", // Cambia por el nombre correcto de la clave primaria de tu tabla de compras
    },
    onDelete: "CASCADE",
  },

  fk_empresa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Empresa,
      key: "emp_codigo", // Si es necesario asociar a una empresa
    },
    onDelete: "RESTRICT",
  },
});

Deuda.sync({ force: false });
