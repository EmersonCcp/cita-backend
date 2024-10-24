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

router.get("/cuotas/:fk_empresa/:ventaId", authenticateToken, getCuotas);
router.get("/cuotas/:fk_empresa/:id", authenticateToken, getCuota);
router.post("/cuotas/:fk_empresa", authenticateToken, createCuota);
router.put("/cuotas/:fk_empresa/:id", authenticateToken, updateCuota);
router.delete("/cuotas/:fk_empresa/:id", authenticateToken, deleteCuota);

export default router;
