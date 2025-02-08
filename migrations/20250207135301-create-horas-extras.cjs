"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'horas_extra'
    await queryInterface.createTable("horas_extra", {
      he_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fk_funcionario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "funcionarios", // Nombre de la tabla 'funcionarios'
          key: "fun_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // Si se elimina el funcionario, no se pueden eliminar sus horas extras
      },
      he_fecha: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      he_horas: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      he_pago_hora: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      he_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      he_descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      he_estado: {
        type: Sequelize.ENUM("pendiente", "completado", "cancelado"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla 'empresas'
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // No se puede eliminar la empresa si está relacionada con horas extra
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
    // Eliminar la tabla 'horas_extra'
    await queryInterface.dropTable("horas_extra");
  },
};
