import { Router } from "express";
import {
  getProveedor,
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedores.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/proveedores/:limit/:pagination/:query",
  authenticateToken,
  getProveedores
);
router.get("/proveedores/:id", authenticateToken, getProveedor);
router.post("/proveedores", authenticateToken, createProveedor);
router.put("/proveedores/:id", authenticateToken, updateProveedor);
router.delete("/proveedores/:id", authenticateToken, deleteProveedor);

export default router;
