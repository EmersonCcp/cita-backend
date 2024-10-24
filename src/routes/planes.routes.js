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

router.get("/planes/:limit/:pagination/:query", authenticateToken, getPlanes);
router.get("/planes/:id", authenticateToken, getPlan);
router.post("/planes", createPlan);
router.put("/planes/:id", authenticateToken, updatePlan);
router.delete("/planes/:id", authenticateToken, deletePlan);

export default router;
