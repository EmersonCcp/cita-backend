import { Router } from "express";
import {
  getCompras,
  getCompra,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../controllers/compras.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/compras/:limit/:pagination/:query", getCompras);
router.get("/compras/:id", getCompra);
router.post("/compras", createCompra);
router.put("/compras/:id", updateCompra);
router.delete("/compras/:id", deleteCompra);

export default router;
