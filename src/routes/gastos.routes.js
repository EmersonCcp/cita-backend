import { Router } from "express";
import {
  getGasto,
  getGastosWithSearch,
  createGasto,
  updateGasto,
  deleteGasto,
} from "../controllers/gastos.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/gastos/:fk_empresa/:limit/:pagination/:query",
  getGastosWithSearch
);
router.get("/gastos/:fk_empresa/:id", getGasto);
router.post("/gastos/:fk_empresa", createGasto);
router.put("/gastos/:fk_empresa/:id", updateGasto);
router.delete("/gastos/:fk_empresa/:id", deleteGasto);

export default router;
