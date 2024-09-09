import { Router } from "express";
import {
  saveOrUpdateDetallesVenta,
  getDetallesByVentaId,
  deleteDetalleVenta,
} from "../controllers/detalle_ventas.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/detalles_ventas/:ventaId", getDetallesByVentaId);
// router.get("/compras/:id", getCompra);
router.post("/detalles_ventas", saveOrUpdateDetallesVenta);
// router.put("/compras/:id", updateCompra);
router.delete("/detalles_ventas/:id", deleteDetalleVenta);

export default router;
