import { Router } from "express";
import {
  getProveedor,
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedores.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/proveedores/:limit/:pagination/:query", getProveedores);
router.get("/proveedores/:id", getProveedor);
router.post("/proveedores", createProveedor);
router.put("/proveedores/:id", updateProveedor);
router.delete("/proveedores/:id", deleteProveedor);

export default router;
