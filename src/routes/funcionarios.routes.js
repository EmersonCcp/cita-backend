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

router.get("/funcionarios/:fk_empresa", authenticateToken, getFuncionarios);
router.get(
  "/funcionarios/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getFuncionariosWithSearch
);
router.get("/funcionarios/:fk_empresa/:id", authenticateToken, getFuncionario);
router.post("/funcionarios/:fk_empresa", authenticateToken, createFuncionario);
router.put(
  "/funcionarios/:fk_empresa/:id",
  authenticateToken,
  updateFuncionario
);
router.delete(
  "/funcionarios/:fk_empresa/:id",
  authenticateToken,
  deleteFuncionario
);

export default router;
