import { Router } from "express";
import {
  getVale,
  getAllWithSearch,
  createVale,
  updateVale,
  deleteVale,
} from "../controllers/vales.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/vales/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/vales/:id", authenticateToken, getVale);
router.post("/vales", authenticateToken, createVale);
router.put("/vales/:id", authenticateToken, updateVale);
router.delete("/vales/:id", authenticateToken, deleteVale);

export default router;
