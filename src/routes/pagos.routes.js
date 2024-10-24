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
  "/pagos/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/pagos/:fk_empresa/:id", authenticateToken, getPago);
router.post("/pagos/:fk_empresa", authenticateToken, createPago);
router.put("/pagos/:fk_empresa/:id", authenticateToken, updatePago);
router.delete("/pagos/:fk_empresa/:id", authenticateToken, deletePago);

export default router;
