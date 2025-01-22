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
  getEntities
);
router.get("/movimientos_cajas/:fk_empresa/:id", getEntity);
router.post("/movimientos_cajas/:fk_empresa", createEntity);
router.put("/movimientos_cajas/:fk_empresa/:id", updateEntity);
router.delete("/movimientos_cajas/:fk_empresa/:id", deleteEntity);

export default router;
