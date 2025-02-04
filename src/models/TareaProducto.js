import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";
import { DetalleFabricacion } from "./DetalleFabricacion.js";
import { Tipo } from "./Tipo.js";
import { Funcionario } from "./Funcionario.js";

export const TareaProducto = sequelize.define("tareas_producto", {
  tp_codigo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tp_estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  fk_detalle_fabricacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DetalleFabricacion,
      key: "df_codigo",
    },
    onDelete: "RESTRICT",
  },

  fk_tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tipo,
      key: "tip_codigo",
    },
    onDelete: "RESTRICT",
  },

  fk_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcionario,
      key: "fun_codigo",
    },
    onDelete: "RESTRICT",
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

TareaProducto.sync({ alter: false });
