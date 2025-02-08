"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'pagos'
    await queryInterface.createTable("pagos", {
      pago_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_funcionario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "funcionarios", // Nombre de la tabla 'funcionarios'
          key: "fun_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
      pago_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      pago_fecha: {
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
    // Eliminar la tabla 'pagos'
    await queryInterface.dropTable("pagos");
  },
};
