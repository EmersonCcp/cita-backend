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
$$ LANGUAGE plpgsql;


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
