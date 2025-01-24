import { Router } from "express";
import {
  getEmpresa,
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../controllers/empresas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/empresas/:limit/:pagination/:query", getEmpresas);
router.get("/empresas/:id", getEmpresa);
router.post("/empresas", createEmpresa);
router.put("/empresas/:id", updateEmpresa);
router.delete("/empresas/:id", deleteEmpresa);

export default router;
