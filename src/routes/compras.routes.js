import { Router } from "express";
import {
  getCompras,
  getCompra,
  createCompra,
  updateCompra,
  deleteCompra,
  actualizarEstadoEntrega,
} from "../controllers/compras.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/compras/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getCompras
);
router.get("/compras/:fk_empresa/:id", authenticateToken, getCompra);
router.post("/compras/:fk_empresa", authenticateToken, createCompra);
router.post(
  "/compras/:fk_empresa/change-estado",
  authenticateToken,
  actualizarEstadoEntrega
);
router.put("/compras/:fk_empresa/:id", authenticateToken, updateCompra);
router.delete("/compras/:fk_empresa/:id", authenticateToken, deleteCompra);

export default router;
