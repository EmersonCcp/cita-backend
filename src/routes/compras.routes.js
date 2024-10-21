import { Router } from "express";
import {
  getCompras,
  getCompra,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../controllers/compras.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/compras/:limit/:pagination/:query", authenticateToken, getCompras);
router.get("/compras/:id", authenticateToken, getCompra);
router.post("/compras", authenticateToken, createCompra);
router.put("/compras/:id", authenticateToken, updateCompra);
router.delete("/compras/:id", authenticateToken, deleteCompra);

export default router;
