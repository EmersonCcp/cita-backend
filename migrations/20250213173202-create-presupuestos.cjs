"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("presupuestos", {
      pres_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pres_fecha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pres_estado: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pendiente",
      },
      pres_fecha_vencimiento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pres_numero: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pres_obs: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productos: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      fk_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clientes", // Nombre de la tabla, no del modelo
          key: "cli_codigo",
        },
        onDelete: "RESTRICT",
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla, no del modelo
          key: "emp_codigo",
        },
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("presupuestos");
  },
};
