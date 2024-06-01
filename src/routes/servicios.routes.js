import { Router } from "express";
import {
  getServicio,
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio
} from "../controllers/servicio.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/api/servicios", getServicios);
router.get("/api/servicio/:id", getServicio);
router.post("/api/servicio", createServicio);
router.put("/api/servicio/:id", updateServicio);
router.delete("/api/servicio/:id", deleteServicio);

export default router;