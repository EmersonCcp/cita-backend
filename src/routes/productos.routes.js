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
  "/productos/:limit/:pagination/:query",
  authenticateToken,
  getProductos
);
router.get("/productos/:id", authenticateToken, getProducto);
router.post("/productos", authenticateToken, createProducto);
router.put("/productos/:id", authenticateToken, updateProducto);
router.delete("/productos/:id", authenticateToken, deleteProducto);

export default router;
