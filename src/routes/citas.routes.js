import { Router } from "express";
import {
  getCita,
  updateEstado,
  getAllWithSearch,
  createCita,
  updateCita,
  deleteCita,
} from "../controllers/cita.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/citas/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/citas/:fk_empresa/:id", authenticateToken, getCita);
router.post("/citas/:fk_empresa", authenticateToken, createCita);
router.put("/citas/:fk_empresa/:id", authenticateToken, updateCita);
router.put("/citas/:fk_empresa/:id/:estado", authenticateToken, updateEstado);
router.delete("/citas/:fk_empresa/:id", authenticateToken, deleteCita);

export default router;
