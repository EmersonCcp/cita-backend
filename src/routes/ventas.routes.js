import { Router } from "express";
import {
  getVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta,
} from "../controllers/ventas.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

// router.get("/ventas", getventas);
router.get("/ventas/:limit/:pagination/:query", getVentas);
router.get("/ventas/:id", getVenta);
router.post("/ventas", createVenta);
router.put("/ventas/:id", updateVenta);
router.delete("/ventas/:id", deleteVenta);

export default router;
