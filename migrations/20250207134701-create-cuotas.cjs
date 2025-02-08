"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'cuotas'
    await queryInterface.createTable("cuotas", {
      cuo_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_operacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // Tipo de operación: "venta" o "compra"
      cuo_tipo_operacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cuo_numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cuo_fecha_vencimiento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cuo_fecha_pago: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cuo_monto: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      cuo_estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla 'empresas'
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar una cuota si está relacionada con una empresa
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
    // Eliminar la tabla 'cuotas'
    await queryInterface.dropTable("cuotas");
  },
};
