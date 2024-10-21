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

router.get("/notificaciones", authenticateToken, getNotificaciones);
// router.get("/proyecto/:id", getProyectoById);
router.post("/notificacion", authenticateToken, createNotificacion);
router.put("/notificacion/:id", authenticateToken, updateNotificacion);
router.put(
  "/notificacion-visto/:id",
  authenticateToken,

  updateVistoNotificacion
);
router.delete("/notificacion/:id", authenticateToken, deleteNotificacion);

export default router;
