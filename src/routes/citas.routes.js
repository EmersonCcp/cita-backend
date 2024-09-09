import { Router } from "express";
import {
  getCita,
  updateEstado,
  getAllWithSearch,
  createCita,
  updateCita,
  deleteCita,
} from "../controllers/cita.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/citas/:limit/:pagination/:query", getAllWithSearch);
router.get("/citas/:id", getCita);
router.post("/citas", createCita);
router.put("/citas/:id", updateCita);
router.put("/cita-estado/:id/:estado", updateEstado);
router.delete("/citas/:id", deleteCita);

export default router;
