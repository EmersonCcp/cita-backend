"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'deudas'
    await queryInterface.createTable("deudas", {
      deuda_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      deuda_fecha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deuda_monto_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      deuda_estado: {
        type: Sequelize.ENUM("pendiente", "pagado", "cancelado"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      deuda_num_cuotas: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deuda_tipo_operacion: {
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
          model: "empresas", // Nombre de la tabla 'empresas'
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la tabla 'deudas'
    await queryInterface.dropTable("deudas");
  },
};
