"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'proveedores'
    await queryInterface.createTable("proveedores", {
      prov_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      prov_nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prov_ruc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      prov_documento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      prov_telefono: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      prov_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla 'empresas'
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar el proveedor si está relacionado con una empresa
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
    // Eliminar la tabla 'proveedores'
    await queryInterface.dropTable("proveedores");
  },
};
