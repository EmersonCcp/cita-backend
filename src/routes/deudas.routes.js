import { Router } from "express";
import {
  getDeudasWithSearch,
  getDeuda,
  createDeuda,
  updateDeuda,
  deleteDeuda,
} from "../controllers/deudas.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/deudas/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getDeudasWithSearch
);
router.get("/deudas/:fk_empresa/:id", authenticateToken, getDeuda);
router.post("/deudas/:fk_empresa", authenticateToken, createDeuda);
router.put("/deudas/:fk_empresa/:id", authenticateToken, updateDeuda);
router.delete("/deudas/:fk_empresa/:id", authenticateToken, deleteDeuda);

export default router;
