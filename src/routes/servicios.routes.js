import { Router } from "express";
import {
  getServiciosWithSearch,
  getServicio,
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controllers/servicio.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();
router.get(
  "/servicios/:limit/:pagination/:query",
  authenticateToken,
  getServiciosWithSearch
);
router.get("/servicios", authenticateToken, getServicios);
router.get("/servicios/:id", authenticateToken, getServicio);
router.post("/servicios", authenticateToken, createServicio);
router.put("/servicios/:id", authenticateToken, updateServicio);
router.delete("/servicios/:id", authenticateToken, deleteServicio);

export default router;
