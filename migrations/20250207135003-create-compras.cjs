"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'compras'
    await queryInterface.createTable("compras", {
      com_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      com_precio_total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      com_fecha_compra: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_proveedor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "proveedores", // Nombre de la tabla 'proveedores'
          key: "prov_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar la compra si está relacionada con un proveedor
      },
      com_factura: {
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
        onDelete: "RESTRICT", // No se puede eliminar la compra si está relacionada con una empresa
      },
      com_estado_entrega: {
        type: Sequelize.ENUM("pendiente", "proceso", "entregado", "cancelado"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      com_fecha_entrega: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      com_num_cuotas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      com_fecha_vencimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      com_tipo_pago: {
        type: Sequelize.STRING,
        allowNull: true,
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
    // Eliminar la tabla 'compras'
    await queryInterface.dropTable("compras");
  },
};
