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
  "/servicios/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getServiciosWithSearch
);
router.get("/servicios/:fk_empresa", authenticateToken, getServicios);
router.get("/servicios/:fk_empresa/:id", authenticateToken, getServicio);
router.post("/servicios/:fk_empresa", authenticateToken, createServicio);
router.put("/servicios/:fk_empresa/:id", authenticateToken, updateServicio);
router.delete("/servicios/:fk_empresa/:id", authenticateToken, deleteServicio);

export default router;
