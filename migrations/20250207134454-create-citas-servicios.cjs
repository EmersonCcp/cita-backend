"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'citas_servicios'
    await queryInterface.createTable("citas_servicios", {
      cs_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_cita: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "citas", // Nombre de la tabla 'citas'
          key: "cita_codigo", // Clave foránea
        },
        onDelete: "CASCADE", // Si se elimina una cita, también se eliminan los servicios asociados
      },
      fk_servicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "servicios", // Nombre de la tabla 'servicios'
          key: "ser_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar un servicio si está relacionado con una cita
      },
      cs_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla 'empresas'
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
    // Eliminar la tabla 'citas_servicios'
    await queryInterface.dropTable("citas_servicios");
  },
};
