"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'tipos'
    await queryInterface.createTable("tipos", {
      tip_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tip_nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tip_sigla: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla, no del modelo
          key: "emp_codigo",
        },
        onDelete: "RESTRICT", // Eliminar registros en 'tipos' si la empresa relacionada se elimina
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
    // Eliminar la tabla 'tipos'
    await queryInterface.dropTable("tipos");
  },
};
