import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/fabricaciones.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/fabricaciones/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntities
);
router.get("/fabricaciones/:fk_empresa/:id", authenticateToken, getEntity);
router.post("/fabricaciones/:fk_empresa", authenticateToken, createEntity);
router.put("/fabricaciones/:fk_empresa/:id", authenticateToken, updateEntity);
router.delete(
  "/fabricaciones/:fk_empresa/:id",
  authenticateToken,
  deleteEntity
);

export default router;
