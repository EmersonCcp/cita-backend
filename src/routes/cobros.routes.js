import { Router } from "express";
import {
  getCobrosWithSearch,
  getCobro,
  createCobro,
  updateCobro,
  deleteCobro,
} from "../controllers/cobros.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/cobros/:limit/:pagination/:query",
  authenticateToken,
  getCobrosWithSearch
);
router.get("/cobros/:id", authenticateToken, getCobro);
router.post("/cobros", authenticateToken, createCobro);
router.put("/cobros/:id", authenticateToken, updateCobro);
router.delete("/cobros/:id", authenticateToken, deleteCobro);

export default router;
