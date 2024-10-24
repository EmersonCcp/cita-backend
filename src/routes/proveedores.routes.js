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
  "/proveedores/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getProveedores
);
router.get("/proveedores/:fk_empresa/:id", authenticateToken, getProveedor);
router.post("/proveedores/:fk_empresa", authenticateToken, createProveedor);
router.put("/proveedores/:fk_empresa/:id", authenticateToken, updateProveedor);
router.delete(
  "/proveedores/:fk_empresa/:id",
  authenticateToken,
  deleteProveedor
);

export default router;
