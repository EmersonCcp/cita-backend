CREATE OR REPLACE FUNCTION sumar_producto()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si la compra está en estado 'entregado'
    IF (SELECT com_estado_entrega FROM compras WHERE com_codigo = NEW.fk_compra) = 'entregado' THEN
        UPDATE productos
        SET prod_cantidad = prod_cantidad + NEW.dc_cantidad
        WHERE prod_codigo = NEW.fk_producto AND fk_empresa = NEW.fk_empresa;
    END IF;

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
    -- Verificar si la compra está en estado 'entregado'
    IF (SELECT com_estado_entrega FROM compras WHERE com_codigo = NEW.fk_compra) = 'entregado' THEN
        -- Restar la cantidad anterior
        UPDATE productos
        SET prod_cantidad = prod_cantidad - OLD.dc_cantidad
        WHERE prod_codigo = OLD.fk_producto AND fk_empresa = OLD.fk_empresa;

        -- Sumar la nueva cantidad
        UPDATE productos
        SET prod_cantidad = prod_cantidad + NEW.dc_cantidad
        WHERE prod_codigo = NEW.fk_producto AND fk_empresa = NEW.fk_empresa;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trigger_actualizar_producto
AFTER UPDATE ON "detalle_compras"
FOR EACH ROW
EXECUTE FUNCTION actualizar_producto();


CREATE OR REPLACE FUNCTION restar_producto_al_eliminar_compra()
RETURNS TRIGGER AS $$
DECLARE
    detalle RECORD; -- Declaramos 'detalle' como un RECORD para almacenar cada fila del SELECT
BEGIN
    -- Iterar sobre los detalles de la compra eliminada
    FOR detalle IN 
        SELECT * FROM detalle_compras WHERE fk_compra = OLD.com_codigo
    LOOP
        -- Verificar si la compra está en estado 'entregado'
        IF OLD.com_estado_entrega = 'entregado' THEN
            -- Restar la cantidad del producto en el inventario
            UPDATE productos
            SET prod_cantidad = prod_cantidad - detalle.dc_cantidad
            WHERE prod_codigo = detalle.fk_producto AND fk_empresa = detalle.fk_empresa;
        END IF;
    END LOOP;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_restar_producto_al_eliminar_compra
BEFORE DELETE ON compras
FOR EACH ROW
EXECUTE FUNCTION restar_producto_al_eliminar_compra();




-- control de ventas
CREATE OR REPLACE FUNCTION restar_producto_venta()
RETURNS TRIGGER AS $$
BEGIN
    -- Restar la cantidad del producto en la tabla productos al realizar una venta
    UPDATE productos
    SET prod_cantidad = prod_cantidad - NEW.dv_cantidad
    WHERE prod_codigo = NEW.fk_producto
    AND fk_empresa = NEW.fk_empresa;  -- Agregamos el filtro por empresa

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_restar_producto_venta
AFTER INSERT ON "detalle_ventas"
FOR EACH ROW
EXECUTE FUNCTION restar_producto_venta();

CREATE OR REPLACE FUNCTION actualizar_producto_venta()
RETURNS TRIGGER AS $$
BEGIN
    -- Restar la cantidad antigua del inventario de productos
    UPDATE productos
    SET prod_cantidad = prod_cantidad + OLD.dv_cantidad - NEW.dv_cantidad
    WHERE prod_codigo = OLD.fk_producto
    AND fk_empresa = OLD.fk_empresa;  -- Agregamos el filtro por empresa

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_producto_venta
AFTER UPDATE ON "detalle_ventas"
FOR EACH ROW
EXECUTE FUNCTION actualizar_producto_venta();

CREATE OR REPLACE FUNCTION devolver_producto_venta()
RETURNS TRIGGER AS $$
BEGIN
    -- Sumar la cantidad del producto en la tabla productos al eliminar un detalle de venta
    UPDATE productos
    SET prod_cantidad = prod_cantidad + OLD.dv_cantidad
    WHERE prod_codigo = OLD.fk_producto
    AND fk_empresa = OLD.fk_empresa;  -- Agregamos el filtro por empresa

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_devolver_producto_venta
AFTER DELETE ON "detalle_ventas"
FOR EACH ROW
EXECUTE FUNCTION devolver_producto_venta();
