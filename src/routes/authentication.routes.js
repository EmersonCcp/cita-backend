import { Router } from "express";
import {
  login,
  register,
  authenticateToken,
  changePassword,
} from "../controllers/authentication.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/authenticateToken", authenticateToken);
router.put("/changePassword/:id", changePassword);

export default router;
