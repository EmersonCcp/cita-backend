import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/tipos.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/tipos/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntities
);
router.get("/tipos/:fk_empresa/:id", authenticateToken, getEntity);
router.post("/tipos/:fk_empresa", authenticateToken, createEntity);
router.put("/tipos/:fk_empresa/:id", authenticateToken, updateEntity);
router.delete("/tipos/:fk_empresa/:id", authenticateToken, deleteEntity);

export default router;
