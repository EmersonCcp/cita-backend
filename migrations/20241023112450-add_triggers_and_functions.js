"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION sumar_producto()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Actualiza la cantidad del producto solo si pertenece a la misma empresa
            UPDATE productos
            SET prod_cantidad = prod_cantidad + NEW.dc_cantidad
            WHERE prod_codigo = NEW.fk_producto AND fk_empresa = NEW.fk_empresa;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        --
        CREATE TRIGGER trigger_sumar_producto
        AFTER INSERT ON "detalle_compras"
        FOR EACH ROW
        EXECUTE FUNCTION sumar_producto();

        CREATE OR REPLACE FUNCTION actualizar_producto()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Restar la cantidad antigua del inventario de productos solo si pertenece a la misma empresa
            UPDATE productos
            SET prod_cantidad = prod_cantidad - OLD.dc_cantidad
            WHERE prod_codigo = OLD.fk_producto AND fk_empresa = OLD.fk_empresa;

            -- Sumar la nueva cantidad al inventario de productos solo si pertenece a la misma empresa
            UPDATE productos
            SET prod_cantidad = prod_cantidad + NEW.dc_cantidad
            WHERE prod_codigo = NEW.fk_producto AND fk_empresa = NEW.fk_empresa;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;


        CREATE TRIGGER trigger_actualizar_producto
        AFTER UPDATE ON "detalle_compras"
        FOR EACH ROW
        EXECUTE FUNCTION actualizar_producto();


        CREATE OR REPLACE FUNCTION restar_producto()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Restar la cantidad del producto solo si pertenece a la misma empresa
            UPDATE productos
            SET prod_cantidad = prod_cantidad - OLD.dc_cantidad
            WHERE prod_codigo = OLD.fk_producto AND fk_empresa = OLD.fk_empresa;

            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;`);
  },

  async down(queryInterface, Sequelize) {
    // Aquí eliminamos las funciones y triggers si se revierte la migración
    await queryInterface.sequelize.query(`
      -- Eliminar triggers
      DROP TRIGGER IF EXISTS trigger_sumar_producto ON detalle_compras;
      DROP TRIGGER IF EXISTS trigger_actualizar_producto ON detalle_compras;
      DROP TRIGGER IF EXISTS trigger_restar_producto ON detalle_compras;

      -- Eliminar funciones
      DROP FUNCTION IF EXISTS sumar_producto;
      DROP FUNCTION IF EXISTS actualizar_producto;
      DROP FUNCTION IF EXISTS restar_producto;
    `);
  },
};
