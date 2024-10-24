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

router.get("/clientes/:fk_empresa", authenticateToken, getClientes);
router.get(
  "/clientes/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getClientesWithSearch
);
router.get("/clientes/:fk_empresa/:id", authenticateToken, getCliente);
router.post("/clientes/:fk_empresa", authenticateToken, createCliente);
router.put("/clientes/:fk_empresa/:id", authenticateToken, updateCliente);
router.delete("/clientes/:fk_empresa/:id", authenticateToken, deleteCliente);

export default router;
