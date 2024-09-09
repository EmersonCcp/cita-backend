import { Router } from "express";
import {
  getServiciosWithSearch,
  getServicio,
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controllers/servicio.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/servicios/:limit/:pagination/:query", getServiciosWithSearch);
router.get("/servicios", getServicios);
router.get("/servicios/:id", getServicio);
router.post("/servicios", createServicio);
router.put("/servicios/:id", updateServicio);
router.delete("/servicios/:id", deleteServicio);

export default router;
