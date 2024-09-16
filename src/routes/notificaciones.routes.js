import { Router } from "express";
import {
  getNotificaciones,
  createNotificacion,
  updateNotificacion,
  updateVistoNotificacion,
  deleteNotificacion,
} from "../controllers/notificaciones.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/notificaciones", getNotificaciones);
// router.get("/proyecto/:id", getProyectoById);
router.post("/notificacion", createNotificacion);
router.put("/notificacion/:id", updateNotificacion);
router.put(
  "/notificacion-visto/:id",

  updateVistoNotificacion
);
router.delete("/notificacion/:id", deleteNotificacion);

export default router;
