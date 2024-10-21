import { Router } from "express";
import {
  getHoraExtra,
  getAllWithSearch,
  createHoraExtra,
  updateHoraExtra,
  deleteHoraExtra,
} from "../controllers/horas_extra.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get(
  "/horas_extras/:limit/:pagination/:query",
  authenticateToken,
  getAllWithSearch
);
router.get("/horas_extras/:id", authenticateToken, getHoraExtra);
router.post("/horas_extras", authenticateToken, createHoraExtra);
router.put("/horas_extras/:id", authenticateToken, updateHoraExtra);
router.delete("/horas_extras/:id", authenticateToken, deleteHoraExtra);

export default router;
