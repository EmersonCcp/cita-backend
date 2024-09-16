import { sequelize } from "../database/database.js";
import { DetalleVenta } from "../models/DetalleVenta.js";
import { Venta } from "../models/Venta.js";
import { remove } from "../utils/crudController.js";
import { Producto } from "../models/Producto.js";

export const saveOrUpdateDetallesVenta = async (req, res) => {
  try {
    const { ventaId, detalles } = req.body;

    // Verificar el stock disponible antes de procesar la venta
    for (const detalle of detalles) {
      const { fk_producto, dv_cantidad, dv_precio_unitario } = detalle;

      // Obtener el producto correspondiente
      const producto = await Producto.findByPk(fk_producto);

      if (!producto) {
        return res
          .status(200)
          .json({ message: `Producto no encontrado: ${fk_producto}` });
      }

      // Validar si hay suficiente stock
      if (producto.prod_cantidad < dv_cantidad) {
        console.log("hola");

        const deleted = await Venta.destroy({ where: { ven_codigo: ventaId } });

        return res.status(200).json({
          ok: false,
          message: `Stock insuficiente para el producto: <b>${producto.prod_nombre}</b>.<br><b>Stock disponible:</b> ${producto.prod_cantidad}, <b>solicitado:</b> ${dv_cantidad}`,
        });
      }

      const detalleVenta = await DetalleVenta.create({
        fk_venta: ventaId,
        fk_producto,
        dv_cantidad,
        dv_precio_unitario,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Detalles de venta guardados o actualizados correctamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al guardar o actualizar los detalles de venta",
    });
  }
};

export const getDetallesByVentaId = async (req, res) => {
  const { ventaId } = req.params;

  try {
    // Buscar todos los detalles de venta asociados al ventaId
    const items = await DetalleVenta.findAll({
      where: {
        fk_venta: ventaId,
      },
    });

    console.log({ items });

    if (!items || items.length === 0) {
      return res.status(404).json({
        message:
          "No se encontraron detalles de venta para la venta especificada.",
      });
    }

    res.json({ ok: true, items });
  } catch (error) {
    console.error("Error al obtener los detalles de venta:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error al obtener los detalles de venta." });
  }
};

export const deleteDetalleVenta = remove(DetalleVenta, "dv_codigo");
