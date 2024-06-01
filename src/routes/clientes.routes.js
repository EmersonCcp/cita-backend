import { Router } from "express";
import {
  getCliente,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from "../controllers/cliente.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/api/clientes", getClientes);
router.get("/api/cliente/:id", getCliente);
router.post("/api/cliente", createCliente);
router.put("/api/cliente/:id", updateCliente);
router.delete("/api/cliente/:id", deleteCliente);

export default router;