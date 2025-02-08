"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'asistencias'
    await queryInterface.createTable("asistencias", {
      asis_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      asis_fecha_inicial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      asis_fecha_final: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      asis_registros: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla
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
    // Eliminar la tabla 'asistencias'
    await queryInterface.dropTable("asistencias");
  },
};
