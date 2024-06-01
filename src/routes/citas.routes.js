import { Router } from "express";
import {
  getCita,
  updateEstado,
  getAllCitas,
  createCita,
  updateCita,
  deleteCita
} from "../controllers/cita.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/api/citas", getAllCitas);
router.get("/api/cita/:id", getCita);
router.post("/api/cita", createCita);
router.put("/api/cita/:id", updateCita);
router.put("/api/cita-estado/:id/:estado", updateEstado);
router.delete("/api/cita/:id", deleteCita);

export default router;