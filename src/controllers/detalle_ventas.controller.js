import { sequelize } from "../database/database.js";
import { DetalleVenta } from "../models/DetalleVenta.js";
import { Venta } from "../models/Venta.js";
import { remove } from "../utils/crudController.js";
import { Producto } from "../models/Producto.js";

export const saveOrUpdateDetallesVenta = async (req, res) => {
  const t = await sequelize.transaction(); // Iniciar transacción
  try {
    const { ventaId, detalles } = req.body;
    const { fk_empresa } = req.params;

    // Verificar que fk_empresa sea proporcionado
    if (!fk_empresa) {
      return res.status(400).json({
        ok: false,
        message:
          "Debe proporcionar una empresa (fk_empresa) para procesar la venta",
      });
    }

    // Agrupar productos repetidos por fk_producto y sumar las cantidades
    const detallesAgrupados = detalles.reduce((acc, detalle) => {
      const { fk_producto, dv_cantidad, dv_precio_unitario } = detalle;
      if (!acc[fk_producto]) {
        acc[fk_producto] = {
          fk_producto,
          dv_cantidad: 0,
          dv_precio_unitario,
        };
      }
      acc[fk_producto].dv_cantidad += dv_cantidad;
      return acc;
    }, {});

    console.log(detallesAgrupados);

    // Convertir el objeto agrupado en un array de detalles
    const detallesUnificados = Object.values(detallesAgrupados);

    // Verificar el stock disponible antes de procesar la venta
    for (const detalle of detallesUnificados) {
      const { fk_producto, dv_cantidad, dv_precio_unitario } = detalle;

      // Obtener el producto correspondiente
      const producto = await Producto.findByPk(fk_producto, { transaction: t });

      if (!producto) {
        await t.rollback(); // Revertir transacción en caso de error
        return res
          .status(200)
          .json({ message: `Producto no encontrado: ${fk_producto}` });
      }

      // Validar si hay suficiente stock
      if (producto.prod_cantidad < dv_cantidad) {
        await t.rollback(); // Revertir transacción en caso de error
        return res.status(200).json({
          ok: false,
          message: `Stock insuficiente para el producto: <b>${producto.prod_nombre}</b>.<br><b>Stock disponible:</b> ${producto.prod_cantidad}, <b>solicitado:</b> ${dv_cantidad}`,
        });
      } else {
        // Crear o actualizar el detalle de venta
        await DetalleVenta.create(
          {
            fk_venta: ventaId,
            fk_producto,
            dv_cantidad,
            dv_precio_unitario,
            fk_empresa, // Relacionar el detalle de venta con la empresa
          },
          { transaction: t }
        );
      }
    }

    await t.commit(); // Confirmar transacción
    return res.status(200).json({
      ok: true,
      message: "Detalles de venta guardados o actualizados correctamente",
    });
  } catch (error) {
    await t.rollback(); // Revertir transacción en caso de error
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al guardar o actualizar los detalles de venta",
    });
  }
};

export const getDetallesByVentaId = async (req, res) => {
  const { ventaId, fk_empresa } = req.params; // Asegúrate de obtener fk_empresa de los parámetros

  try {
    // Buscar todos los detalles de venta asociados al ventaId y fk_empresa
    const items = await DetalleVenta.findAll({
      where: {
        fk_venta: ventaId,
        fk_empresa, // Agregar la condición para fk_empresa
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
