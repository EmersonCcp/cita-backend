"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'ventas'
    await queryInterface.createTable("ventas", {
      ven_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ven_fecha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ven_precio_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      fk_cliente: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "clientes", // Nombre de la tabla 'clientes'
          key: "cli_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
      fk_funcionario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "funcionarios", // Nombre de la tabla 'funcionarios'
          key: "fun_codigo", // Clave foránea
        },
        onDelete: "RESTRICT",
      },
      ven_factura: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ven_medio_pago: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ven_estado: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ven_observaciones: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ven_estado_entrega: {
        type: Sequelize.ENUM("pendiente", "proceso", "entregado", "cancelado"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      ven_tipo_pago: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ven_num_cuotas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ven_fecha_vencimiento: {
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
    // Eliminar la tabla 'ventas'
    await queryInterface.dropTable("ventas");
  },
};
