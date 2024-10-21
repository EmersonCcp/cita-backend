import { Router } from "express";
import {
  getCuotas,
  getCuota,
  createCuota,
  updateCuota,
  deleteCuota,
} from "../controllers/cuotas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/cuotas/:ventaId", authenticateToken, getCuotas);
router.get("/cuotas/:id", authenticateToken, getCuota);
router.post("/cuotas", authenticateToken, createCuota);
router.put("/cuotas/:id", authenticateToken, updateCuota);
router.delete("/cuotas/:id", authenticateToken, deleteCuota);

export default router;
