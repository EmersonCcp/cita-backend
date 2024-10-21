import { Router } from "express";
import {
  getClientesWithSearch,
  getCliente,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/cliente.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/clientes", authenticateToken, getClientes);
router.get(
  "/clientes/:limit/:pagination/:query",
  authenticateToken,
  getClientesWithSearch
);
router.get("/clientes/:id", authenticateToken, getCliente);
router.post("/clientes", authenticateToken, createCliente);
router.put("/clientes/:id", authenticateToken, updateCliente);
router.delete("/clientes/:id", authenticateToken, deleteCliente);

export default router;
