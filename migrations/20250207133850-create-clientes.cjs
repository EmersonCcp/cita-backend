"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'clientes'
    await queryInterface.createTable("clientes", {
      cli_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cli_nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cli_apellido: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_telefono: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_documento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_ruc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_sexo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_fecha_nacimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_direccion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cli_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla de empresas
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'empresas'
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
    // Eliminar la tabla 'clientes'
    await queryInterface.dropTable("clientes");
  },
};
