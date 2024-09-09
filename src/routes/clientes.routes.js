import { Router } from "express";
import {
  getClientesWithSearch,
  getCliente,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/cliente.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/clientes", getClientes);
router.get("/clientes/:limit/:pagination/:query", getClientesWithSearch);
router.get("/clientes/:id", getCliente);
router.post("/clientes", createCliente);
router.put("/clientes/:id", updateCliente);
router.delete("/clientes/:id", deleteCliente);

export default router;
