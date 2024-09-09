import { Router } from "express";
import {
  getFuncionariosWithSearch,
  getFuncionarios,
  getFuncionario,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario,
} from "../controllers/funcionarios.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/funcionarios", getFuncionarios);
router.get(
  "/funcionarios/:limit/:pagination/:query",
  getFuncionariosWithSearch
);
router.get("/funcionarios/:id", getFuncionario);
router.post("/funcionarios", createFuncionario);
router.put("/funcionarios/:id", updateFuncionario);
router.delete("/funcionarios/:id", deleteFuncionario);

export default router;
