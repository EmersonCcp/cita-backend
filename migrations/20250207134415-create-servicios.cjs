"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'servicios'
    await queryInterface.createTable("servicios", {
      ser_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ser_nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ser_descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ser_precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      ser_imgUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ser_imgKey: {
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
        onDelete: "RESTRICT", // No se puede eliminar un servicio si está relacionado con una empresa
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
    // Eliminar la tabla 'servicios'
    await queryInterface.dropTable("servicios");
  },
};
