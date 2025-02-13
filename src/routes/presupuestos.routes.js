import { Router } from "express";
import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  getEntitiesWithSearch,
} from "../controllers/presupuestos.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/presupuestos/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getEntitiesWithSearch
);
router.get("/presupuestos/:fk_empresa/:id", authenticateToken, getEntity);
router.post("/presupuestos/:fk_empresa", authenticateToken, createEntity);
router.put("/presupuestos/:fk_empresa/:id", authenticateToken, updateEntity);
router.delete("/presupuestos/:fk_empresa/:id", authenticateToken, deleteEntity);

export default router;
