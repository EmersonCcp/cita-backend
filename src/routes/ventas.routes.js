import { Router } from "express";
import {
  getVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta,
} from "../controllers/ventas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

// router.get("/ventas", getventas);
router.get("/ventas/:limit/:pagination/:query", authenticateToken, getVentas);
router.get("/ventas/:id", authenticateToken, getVenta);
router.post("/ventas", authenticateToken, createVenta);
router.put("/ventas/:id", authenticateToken, updateVenta);
router.delete("/ventas/:id", authenticateToken, deleteVenta);

export default router;
