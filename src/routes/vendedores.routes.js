import { Router } from "express";
import {
  getVendedorsWithSearch,
  getVendedor,
  createVendedor,
  updateVendedor,
  deleteVendedor,
} from "../controllers/vendedores.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

// router.get("/vendedores", getClientes);
router.get("/vendedores/:limit/:pagination/:query", getVendedorsWithSearch);
router.get("/vendedores/:id", getVendedor);
router.post("/vendedores", createVendedor);
router.put("/vendedores/:id", updateVendedor);
router.delete("/vendedores/:id", deleteVendedor);

export default router;
