import { Router } from "express";
import {
  getPlan,
  getPlanes,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planes.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/planes/:limit/:pagination/:query", getPlanes);
router.get("/planes/:id", getPlan);
router.post("/planes", createPlan);
router.put("/planes/:id", updatePlan);
router.delete("/planes/:id", deletePlan);

export default router;
