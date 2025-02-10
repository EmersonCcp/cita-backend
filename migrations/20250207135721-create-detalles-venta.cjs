"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'detalle_ventas'
    await queryInterface.createTable("detalle_ventas", {
      dv_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_venta: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "ventas", // Nombre de la tabla 'ventas'
          key: "ven_codigo", // Clave foránea
        },
        onDelete: "CASCADE",
      },
      fk_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "productos", // Nombre de la tabla 'productos'
          key: "prod_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
      dv_cantidad: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      dv_precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
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
    // Eliminar la tabla 'detalle_ventas'
    await queryInterface.dropTable("detalle_ventas");
  },
};
