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
  "/cobros/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getCobrosWithSearch
);
router.get("/cobros/:fk_empresa/:id", authenticateToken, getCobro);
router.post("/cobros/:fk_empresa", authenticateToken, createCobro);
router.put("/cobros/:fk_empresa/:id", authenticateToken, updateCobro);
router.delete("/cobros/:fk_empresa/:id", authenticateToken, deleteCobro);

export default router;
