"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'funcionarios'
    await queryInterface.createTable("funcionarios", {
      fun_codigo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fun_nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fun_apellido: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_telefono: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_documento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_sexo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_fecha_nacimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_fecha_cobro: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_fecha_ingreso: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_check_asistencia: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      fun_salario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      fun_direccion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fun_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla de empresas
          key: "emp_codigo", // Clave foránea
        },
        onDelete: "RESTRICT", // Comportamiento cuando se elimina un registro en la tabla 'empresas'
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
    // Eliminar la tabla 'funcionarios'
    await queryInterface.dropTable("funcionarios");
  },
};
