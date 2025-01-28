import { Router } from "express";
import {
  getVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta,
  actualizarEstadoEntrega,
} from "../controllers/ventas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

// router.get("/ventas", getventas);
router.get(
  "/ventas/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getVentas
);
router.get("/ventas/:fk_empresa/:id", authenticateToken, getVenta);
router.post("/ventas/:fk_empresa", authenticateToken, createVenta);
router.post(
  "/ventas/:fk_empresa/change-estado",
  authenticateToken,
  actualizarEstadoEntrega
);
router.put("/ventas/:fk_empresa/:id", authenticateToken, updateVenta);
router.delete("/ventas/:fk_empresa/:id", authenticateToken, deleteVenta);

export default router;
