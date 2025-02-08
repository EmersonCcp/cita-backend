"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("empresas", {
      emp_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      emp_nombre: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      emp_descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      emp_pais: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      emp_ciudad: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      emp_telefono: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      emp_estado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      emp_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      fk_plan: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "planes", // Nombre de la tabla que contiene la clave primaria 'plan_codigo'
          key: "plan_codigo",
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
    await queryInterface.dropTable("empresas");
  },
};
