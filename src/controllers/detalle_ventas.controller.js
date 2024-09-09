import { sequelize } from "../database/database.js";
import { DetalleVenta } from "../models/DetalleVenta.js";
import { Venta } from "../models/Venta.js";
import { remove } from "../utils/crudController.js";
import { Producto } from "../models/Producto.js";

export const saveOrUpdateDetallesVenta = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciar una transacción

  try {
    const { ventaId, detalles } = req.body;

    // Validar si la venta existe
    const venta = await Venta.findByPk(ventaId, { transaction });
    if (!venta) {
      await transaction.rollback(); // Revertir la transacción si falla
      return res.status(200).json({ message: "Venta no encontrada" });
    }

    // Verificar el stock disponible antes de procesar la venta
    for (const detalle of detalles) {
      const { fk_producto, dv_cantidad } = detalle;

      // Obtener el producto correspondiente
      const producto = await Producto.findByPk(fk_producto, { transaction });

      if (!producto) {
        await transaction.rollback(); // Revertir la transacción si falla
        return res
          .status(200)
          .json({ message: `Producto no encontrado: ${fk_producto}` });
      }

      // Validar si hay suficiente stock
      if (producto.prod_cantidad < dv_cantidad) {
        const deleted = await Venta.destroy({ where: { ven_codigo: ventaId } });
        console.log({ deleted });

        await transaction.rollback(); // Revertir la transacción si no hay suficiente stock
        return res.status(200).json({
          ok: false,
          message: `Stock insuficiente para el producto: <b>${producto.prod_nombre}</b>.<br><b>Stock disponible:</b> ${producto.prod_cantidad}, <b>solicitado:</b> ${dv_cantidad}`,
        });
      }

      // Restar la cantidad del stock
      // producto.prod_cantidad -= dv_cantidad;
      // await producto.save({ transaction });
    }

    // Iterar sobre el array de detalles de venta
    for (const detalle of detalles) {
      const { dv_codigo, fk_producto, dv_cantidad, dv_precio_unitario } =
        detalle;

      // Verificar si el detalle ya existe (actualizar si es el caso)
      if (dv_codigo) {
        const detalleExistente = await DetalleVenta.findByPk(dv_codigo, {
          transaction,
        });
        if (detalleExistente) {
          await detalleExistente.update(
            {
              fk_producto,
              dv_cantidad,
              dv_precio_unitario,
            },
            { transaction }
          );
        }
      } else {
        // Si no existe, crear un nuevo detalle
        await DetalleVenta.create(
          {
            fk_venta: ventaId,
            fk_producto,
            dv_cantidad,
            dv_precio_unitario,
          },
          { transaction }
        );
      }
    }

    await transaction.commit(); // Confirmar la transacción si todo salió bien
    return res.status(200).json({
      ok: true,
      message: "Detalles de venta guardados o actualizados correctamente",
    });
  } catch (error) {
    await transaction.rollback(); // Revertir la transacción en caso de error
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
