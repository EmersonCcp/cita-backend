import { Router } from "express";
import {
  getCuotas,
  getCuota,
  createCuota,
  updateCuota,
  deleteCuota,
} from "../controllers/cuotas.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/cuotas/:ventaId", getCuotas);
router.get("/cuotas/:id", getCuota);
router.post("/cuotas", createCuota);
router.put("/cuotas/:id", updateCuota);
router.delete("/cuotas/:id", deleteCuota);

export default router;
