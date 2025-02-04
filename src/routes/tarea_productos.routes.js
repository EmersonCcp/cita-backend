import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/tarea_productos.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/tareas_productos/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntities
);
router.get("/tareas_productos/:fk_empresa/:id", authenticateToken, getEntity);
router.post("/tareas_productos/:fk_empresa", authenticateToken, createEntity);
router.put(
  "/tareas_productos/:fk_empresa/:id",
  authenticateToken,
  updateEntity
);
router.delete(
  "/tareas_productos/:fk_empresa/:id",
  authenticateToken,
  deleteEntity
);

export default router;
