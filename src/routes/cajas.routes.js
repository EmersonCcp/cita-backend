import { Router } from "express";
import {
  getCajasWithSearch,
  getCajas,
  getCaja,
  createCaja,
  updateCaja,
  deleteCaja,
} from "../controllers/cajas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/cajas/:fk_empresa", getCajas);
router.get(
  "/cajas/:fk_empresa/:limit/:pagination/:query",

  getCajasWithSearch
);
router.get("/cajas/:fk_empresa/:id", getCaja);
router.post("/cajas/:fk_empresa", createCaja);
router.put("/cajas/:fk_empresa/:id", updateCaja);
router.delete("/cajas/:fk_empresa/:id", deleteCaja);

export default router;
