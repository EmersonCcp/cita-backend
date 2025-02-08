"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'cajas'
    await queryInterface.createTable("cajas", {
      caja_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caja_descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      caja_turno: {
        //mañana, tarde, noche, dia completo
        type: Sequelize.STRING,
        allowNull: false,
      },
      caja_fecha_inicial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      caja_fecha_final: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Nombre de la tabla de usuarios
          key: "id", // Clave foránea
        },
        onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'users'
      },
      caja_saldo_inicial: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      caja_saldo_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      caja_saldo_final: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      caja_estado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
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
    // Eliminar la tabla 'cajas'
    await queryInterface.dropTable("cajas");
  },
};
