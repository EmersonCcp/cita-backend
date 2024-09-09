import { Router } from "express";
import {
  getAllCitasServicios,
  getCitaServicio,
  createCitaServicio,
  updateCitaServicio,
  deleteCitaServicio,
} from "../controllers/cita_servicio.controller.js";
const router = Router();

router.get("/citas_servicios/:id", getAllCitasServicios);
router.get("/citas_servicios/:id", getCitaServicio);
router.post("/citas_servicios", createCitaServicio);
router.put("/citas_servicios/:id", updateCitaServicio);
router.delete("/citas_servicios/:id", deleteCitaServicio);
// router.delete("/citas_servicios/:id", deleteCitaServicio);

export default router;
