import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/asistencia.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/asistencias/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntities
);
router.get("/asistencias/:fk_empresa/:id", authenticateToken, getEntity);
router.post("/asistencias/:fk_empresa", authenticateToken, createEntity);
router.put("/asistencias/:fk_empresa/:id", authenticateToken, updateEntity);
router.delete("/asistencias/:fk_empresa/:id", authenticateToken, deleteEntity);

export default router;
