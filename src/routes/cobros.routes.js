import { Router } from "express";
import {
  getCobrosWithSearch,
  getCobro,
  createCobro,
  updateCobro,
  deleteCobro,
} from "../controllers/cobros.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/cobros/:limit/:pagination/:query", getCobrosWithSearch);
router.get("/cobros/:id", getCobro);
router.post("/cobros", createCobro);
router.put("/cobros/:id", updateCobro);
router.delete("/cobros/:id", deleteCobro);

export default router;
