import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  updateEmail,
} from "../controllers/users.controllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/users/:limit/:pagination/:query", authenticateToken, getUsers);
router.get("/users/:id", getUser);
router.put("/users/email_update/:id", updateEmail);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);

export default router;
