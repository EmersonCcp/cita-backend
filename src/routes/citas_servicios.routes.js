import { Router } from "express";
import {
  getAllCitasServicios,
  getCitaServicio,
  createCitaServicio,
  updateCitaServicio,
  deleteCitaServicio,
} from "../controllers/cita_servicio.controller.js";
const router = Router();

router.get("/citas_servicios/:fk_empresa/:id", getAllCitasServicios);
// router.get("/citas_servicios/:fk_empresa/:id", getCitaServicio);
router.post("/citas_servicios/:fk_empresa", createCitaServicio);
router.put("/citas_servicios/:fk_empresa/:id", updateCitaServicio);
router.delete("/citas_servicios/:fk_empresa/:id", deleteCitaServicio);
// router.delete("/citas_servicios/:id", deleteCitaServicio);

export default router;
