import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empresa } from "./Empresa.js";

const rolesEnum = [
  "ADMIN",
  "CLIENTES",
  "FUNCIONARIOS",
  "SERVICIOS",
  "CITAS",
  "PROVEEDORES",
  "PRODUCTOS",
  "COMPRAS",
  "VENTAS",
  "COBROS",
  "EXPORTACIONES",
  "DASHBOARD",
  "USER",
  "VALES",
  "PAGOS",
  "HORAS_EXTRA",
  "PLANES",
  "EMPRESAS",
  "DEUDAS",
  "CAJAS",
];

export const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true, // Esto asegura que el email tenga un formato de email válido
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, Infinity], // Esto asegura que el password tenga al menos 5 caracteres
    },
  },
  jwtToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.ENUM(...rolesEnum)),
    allowNull: true,
    defaultValue: ["DASHBOARD"],
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

User.sync({ alter: false });
