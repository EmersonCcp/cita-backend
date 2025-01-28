import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Caja } from "./Caja.js";
import { Empresa } from "./Empresa.js";

export const MovimientoCaja = sequelize.define("movimientos_cajas", {
  mc_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  mc_tipo: {
    // ingreso o egreso
    type: DataTypes.ENUM("ingreso", "egreso"),
    allowNull: false,
  },

  mc_monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  mc_descripcion: {
    type: DataTypes.STRING,
    allowNull: true, // Opcional: descripción del movimiento
  },

  mc_fecha: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Fecha de registro
  },

  fk_operacion: {
    // ID de la operación (venta o compra)
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  mc_tipo_operacion: {
    // Tipo de operación: "venta" o "compra"
    type: DataTypes.ENUM("venta", "compra"),
    allowNull: false,
  },

  fk_caja: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Caja,
      key: "caja_codigo",
    },
    onDelete: "RESTRICT", // Si se elimina la caja, también los movimientos
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

MovimientoCaja.sync({ alter: false });
