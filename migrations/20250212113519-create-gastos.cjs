"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gastos", {
      gas_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gas_nombre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gas_descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gas_factura: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gas_precio_total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      gas_fecha: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_tipo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tipos", // Asegúrate de que este sea el nombre correcto de la tabla en la BD
          key: "tip_codigo",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fk_proveedor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "proveedors", // Verifica el nombre de la tabla en la BD
          key: "pro_codigo",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("gastos");
  },
};
