"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'notificaciones'
    await queryInterface.createTable("notificaciones", {
      noti_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      noti_mensaje: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      noti_rango: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      noti_visto: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    // Eliminar la tabla 'notificaciones'
    await queryInterface.dropTable("notificaciones");
  },
};
