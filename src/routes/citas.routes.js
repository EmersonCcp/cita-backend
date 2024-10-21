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
  "/citas/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/citas/:id", authenticateToken, getCita);
router.post("/citas", authenticateToken, createCita);
router.put("/citas/:id", authenticateToken, updateCita);
router.put("/cita-estado/:id/:estado", authenticateToken, updateEstado);
router.delete("/citas/:id", authenticateToken, deleteCita);

export default router;
