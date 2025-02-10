"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cobros", {
      cob_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cob_fecha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cob_monto_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      cob_estado: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pendiente",
      },
      cob_num_cuotas: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cob_tipo_operacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fk_operacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas",
          key: "emp_codigo",
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cobros");
  },
};
