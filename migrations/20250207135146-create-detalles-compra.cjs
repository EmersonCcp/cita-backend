"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'detalle_compras'
    await queryInterface.createTable("detalle_compras", {
      dc_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_compra: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "compras", // Nombre de la tabla 'compras'
          key: "com_codigo", // Clave foránea
        },
        onDelete: "CASCADE", // Si se elimina la compra, se eliminan los detalles
      },
      fk_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "productos", // Nombre de la tabla 'productos'
          key: "prod_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar el producto si está relacionado con un detalle
      },
      dc_cantidad: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      dc_precio_unitario: {
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
        onDelete: "RESTRICT", // No se puede eliminar el detalle si está relacionado con una empresa
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
    // Eliminar la tabla 'detalle_compras'
    await queryInterface.dropTable("detalle_compras");
  },
};
