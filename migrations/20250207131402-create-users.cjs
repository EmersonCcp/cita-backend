"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla 'users'
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [5, Infinity],
        },
      },
      jwtToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Cambiado a JSON
        allowNull: true,
        defaultValue: ["DASHBOARD"],
      },
      fk_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas", // Nombre de la tabla, no del modelo
          key: "emp_codigo",
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
    // Eliminar la tabla 'users'
    await queryInterface.dropTable("users");
  },
};
