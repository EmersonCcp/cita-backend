import { Router } from "express";
import {
  saveOrUpdateDetallesVenta,
  getDetallesByVentaId,
  deleteDetalleVenta,
} from "../controllers/detalle_ventas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/detalles_ventas/:fk_empresa/:ventaId",
  authenticateToken,
  getDetallesByVentaId
);
// router.get("/compras/:id", getCompra);
router.post(
  "/detalles_ventas/:fk_empresa",
  authenticateToken,
  saveOrUpdateDetallesVenta
);
// router.put("/compras/:id", updateCompra);
router.delete(
  "/detalles_ventas/:fk_empresa/:id",
  authenticateToken,
  deleteDetalleVenta
);

export default router;
