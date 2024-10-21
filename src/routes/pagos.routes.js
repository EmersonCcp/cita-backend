import { Router } from "express";
import {
  getPago,
  getAllWithSearch,
  createPago,
  updatePago,
  deletePago,
} from "../controllers/pagos.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/pagos/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/pagos/:id", authenticateToken, getPago);
router.post("/pagos", authenticateToken, createPago);
router.put("/pagos/:id", authenticateToken, updatePago);
router.delete("/pagos/:id", authenticateToken, deletePago);

export default router;
