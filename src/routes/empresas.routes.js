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

router.get(
  "/empresas/:limit/:pagination/:query",
  authenticateToken,
  getEmpresas
);
router.get("/empresas/:id", authenticateToken, getEmpresa);
router.post("/empresas", createEmpresa);
router.put("/empresas/:id", authenticateToken, updateEmpresa);
router.delete("/empresas/:id", authenticateToken, deleteEmpresa);

export default router;
