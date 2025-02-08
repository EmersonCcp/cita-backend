"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'productos'
    await queryInterface.createTable("productos", {
      prod_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      prod_nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prod_descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imgKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      prod_cantidad: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      prod_cantidad_minima: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      prod_precio_compra: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      prod_precio_venta: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla 'empresas'
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar el producto si está relacionado con una empresa
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
    // Eliminar la tabla 'productos'
    await queryInterface.dropTable("productos");
  },
};
