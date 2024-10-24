import { Router } from "express";
import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/productos/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getProductos
);
router.get("/productos/:fk_empresa/:id", authenticateToken, getProducto);
router.post("/productos/:fk_empresa", authenticateToken, createProducto);
router.put("/productos/:fk_empresa/:id", authenticateToken, updateProducto);
router.delete("/productos/:fk_empresa/:id", authenticateToken, deleteProducto);

export default router;
