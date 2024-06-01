import { Router } from "express";
import {
  getAllCitasServicios,
  getCitaServicio,
  createCitaServicio,
  updateCitaServicio,
  deleteAllById,
  deleteCitaServicio
} from "../controllers/cita_servicio.controller.js";
const router = Router();

router.get("/api/citas_servicios/:id", getAllCitasServicios);
router.get("/api/cita_servicio/:id", getCitaServicio);
router.post("/api/cita_servicio", createCitaServicio);
router.put("/api/cita_servicio/:id", updateCitaServicio);
router.delete("/api/cita_servicios/:id", deleteAllById);
router.delete("/api/cita_servicio/:id", deleteCitaServicio);

export default router;