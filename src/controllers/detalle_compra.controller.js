import { sequelize } from "../database/database.js";
import { DetalleCompra } from "../models/DetalleCompra.js";
import { Compra } from "../models/Compra.js";
import { Producto } from "../models/Producto.js";
import { remove } from "../utils/crudController.js";

export const saveOrUpdateDetallesCompra = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciar una transacción

  try {
    const { compraId, detalles } = req.body;
    const { fk_empresa } = req.params;

    // Validar si la compra existe
    const compra = await Compra.findByPk(compraId, { transaction });
    if (!compra) {
      await transaction.rollback(); // Revertir la transacción si falla
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    // Iterar sobre el array de detalles de compra
    for (const detalle of detalles) {
      const { dc_codigo, fk_producto, dc_cantidad, dc_precio_unitario } =
        detalle;

      // Verificar si el detalle ya existe (actualizar si es el caso)

      if (dc_codigo) {
        const detalleExistente = await DetalleCompra.findByPk(dc_codigo, {
          transaction,
        });
        if (detalleExistente) {
          await detalleExistente.update(
            {
              fk_producto,
              dc_cantidad,
              dc_precio_unitario,
              fk_empresa,
            },
            { transaction }
          );
        }
      } else {
        // Si no existe, crear un nuevo detalle
        await DetalleCompra.create(
          {
            fk_compra: compraId,
            fk_producto,
            dc_cantidad,
            dc_precio_unitario,
            fk_empresa,
          },
          { transaction }
        );
      }
    }

    await transaction.commit(); // Confirmar la transacción si todo salió bien
    return res.status(200).json({
      ok: true,
      message: "Detalles de compra guardados o actualizados correctamente",
    });
  } catch (error) {
    await transaction.rollback(); // Revertir la transacción en caso de error
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al guardar o actualizar los detalles de compra",
    });
  }
};

async function actualizarEstadoEntrega(compraId, nuevoEstado) {
  try {
    // Obtener la compra actual y su estado
    const compra = await Compra.findByPk(compraId);
    if (!compra) throw new Error("Compra no encontrada");

    // Validar cambios de estado
    const estadoAnterior = compra.com_estado_entrega;
    if (estadoAnterior === nuevoEstado) {
      throw new Error("El estado ya es el mismo");
    }

    // Obtener detalles de la compra
    const detallesCompra = await DetalleCompra.findAll({
      where: { fk_compra: compraId },
    });

    // Realizar acciones según el nuevo estado
    switch (nuevoEstado) {
      case "pendiente":
        // No afecta el stock
        break;

      case "proceso":
        // Si se requiere, puedes marcar productos como reservados
        break;

      case "entregado":
        if (estadoAnterior !== "entregado") {
          // Actualizar el stock de cada producto
          for (const detalle of detallesCompra) {
            const producto = await Producto.findByPk(detalle.fk_producto);
            if (!producto) continue;

            // Aumentar el stock
            producto.prod_cantidad += detalle.dc_cantidad;
            await producto.save();
          }
        }
        break;

      case "cancelado":
        if (estadoAnterior === "entregado") {
          // Revertir el stock
          for (const detalle of detallesCompra) {
            const producto = await Producto.findByPk(detalle.fk_producto);
            if (!producto) continue;

            // Reducir el stock
            producto.prod_cantidad -= detalle.dc_cantidad;
            await producto.save();
          }
        }
        break;

      default:
        throw new Error("Estado no válido");
    }

    // Actualizar el estado de la compra
    compra.com_estado_entrega = nuevoEstado;
    await compra.save();

    return { ok: true, message: "Estado de entrega actualizado correctamente" };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

export const getDetallesByCompraId = async (req, res) => {
  const { compraId } = req.params;

  try {
    // Buscar todos los detalles de compra asociados al compraId
    const items = await DetalleCompra.findAll({
      where: {
        fk_compra: compraId,
      },
    });

    if (!items || items.length === 0) {
      return res.status(404).json({
        message:
          "No se encontraron detalles de compra para la compra especificada.",
      });
    }

    res.json({ ok: true, items });
  } catch (error) {
    console.error("Error al obtener los detalles de compra:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error al obtener los detalles de compra." });
  }
};

export const deleteDetalleCompra = remove(DetalleCompra, "dc_codigo");
