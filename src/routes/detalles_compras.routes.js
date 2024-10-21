import { Router } from "express";
import {
  saveOrUpdateDetallesCompra,
  getDetallesByCompraId,
  deleteDetalleCompra,
} from "../controllers/detalle_compra.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/detalles_compras/:compraId",
  authenticateToken,
  getDetallesByCompraId
);
// router.get("/compras/:id", getCompra);
router.post("/detalles_compras", authenticateToken, saveOrUpdateDetallesCompra);
// router.put("/compras/:id", updateCompra);
router.delete("/detalles_compras/:id", authenticateToken, deleteDetalleCompra);

export default router;
