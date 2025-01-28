import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/movimientos_cajas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/movimientos_cajas/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntities
);
router.get("/movimientos_cajas/:fk_empresa/:id", authenticateToken, getEntity);
router.post("/movimientos_cajas/:fk_empresa", authenticateToken, createEntity);
router.put(
  "/movimientos_cajas/:fk_empresa/:id",
  authenticateToken,
  updateEntity
);
router.delete(
  "/movimientos_cajas/:fk_empresa/:id",
  authenticateToken,
  deleteEntity
);

export default router;
