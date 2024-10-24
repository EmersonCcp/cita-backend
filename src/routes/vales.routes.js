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
  "/vales/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/vales/:fk_empresa/:id", authenticateToken, getVale);
router.post("/vales/:fk_empresa", authenticateToken, createVale);
router.put("/vales/:fk_empresa/:id", authenticateToken, updateVale);
router.delete("/vales/:fk_empresa/:id", authenticateToken, deleteVale);

export default router;
