"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'citas'
    await queryInterface.createTable("citas", {
      cita_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clientes", // Nombre de la tabla 'clientes'
          key: "cli_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'clientes'
      },
      fk_funcionario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "funcionarios", // Nombre de la tabla 'funcionarios'
          key: "fun_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'funcionarios'
      },
      cita_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      cita_fecha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cita_hora: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cita_estado: {
        type: Sequelize.ENUM("pendiente", "completado", "cancelado"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      cita_obs: {
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
        onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'empresas'
      },
      // fk_caja: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: "cajas", // Nombre de la tabla 'cajas'
      //     key: "caja_codigo", // Clave foránea
      //   },
      //   onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'cajas'
      // },
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
    // Eliminar la tabla 'citas'
    await queryInterface.dropTable("citas");
  },
};
