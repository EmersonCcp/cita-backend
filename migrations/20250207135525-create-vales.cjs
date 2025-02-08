"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'vales'
    await queryInterface.createTable("vales", {
      vale_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_funcionario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "funcionarios", // Nombre de la tabla 'funcionarios'
          key: "fun_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
      vale_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      vale_fecha: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vale_descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vale_estado: {
        type: Sequelize.ENUM("pendiente", "completado", "cancelado"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla 'empresas'
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la tabla 'vales'
    await queryInterface.dropTable("vales");
  },
};
