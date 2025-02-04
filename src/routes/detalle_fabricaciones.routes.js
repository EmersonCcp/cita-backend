import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/detalle_fabricaciones.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/detalles_fabricaciones/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntities
);
router.get(
  "/detalles_fabricaciones/:fk_empresa/:id",
  authenticateToken,
  getEntity
);
router.post(
  "/detalles_fabricaciones/:fk_empresa",
  authenticateToken,
  createEntity
);
router.put(
  "/detalles_fabricaciones/:fk_empresa/:id",
  authenticateToken,
  updateEntity
);
router.delete(
  "/detalles_fabricaciones/:fk_empresa/:id",
  authenticateToken,
  deleteEntity
);

export default router;
