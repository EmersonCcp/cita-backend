"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'movimientos_cajas'
    await queryInterface.createTable("movimientos_cajas", {
      mc_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mc_tipo: {
        type: Sequelize.ENUM("ingreso", "egreso"),
        allowNull: false,
      },
      mc_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      mc_descripcion: {
        type: Sequelize.STRING,
        allowNull: true, // Opcional: descripción del movimiento
      },
      mc_fecha: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Fecha de registro
      },
      fk_operacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mc_tipo_operacion: {
        type: Sequelize.STRING, // Tipo de operación: "venta", "compra", "cita", "pago"
        allowNull: false,
      },
      fk_caja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cajas", // Nombre de la tabla 'cajas'
          key: "caja_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // Si se elimina la caja, también los movimientos
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
    // Eliminar la tabla 'movimientos_cajas'
    await queryInterface.dropTable("movimientos_cajas");
  },
};
