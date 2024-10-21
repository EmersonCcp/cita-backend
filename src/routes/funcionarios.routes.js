import { Router } from "express";
import {
  getFuncionariosWithSearch,
  getFuncionarios,
  getFuncionario,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario,
} from "../controllers/funcionarios.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/funcionarios", authenticateToken, getFuncionarios);
router.get(
  "/funcionarios/:limit/:pagination/:query",
  authenticateToken,
  getFuncionariosWithSearch
);
router.get("/funcionarios/:id", authenticateToken, getFuncionario);
router.post("/funcionarios", authenticateToken, createFuncionario);
router.put("/funcionarios/:id", authenticateToken, updateFuncionario);
router.delete("/funcionarios/:id", authenticateToken, deleteFuncionario);

export default router;
