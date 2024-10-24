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

router.get(
  "/users/:fk_empresa/:limit/:pagination/:query",
  authenticateToken,
  getUsers
);
router.get("/users/:fk_empresa/:id", authenticateToken, getUser);
router.put(
  "/users/:fk_empresa/email_update/:id",
  authenticateToken,
  updateEmail
);
router.post("/users/:fk_empresa", authenticateToken, createUser);
router.put("/users/:fk_empresa/:id", authenticateToken, updateUser);
router.delete("/users/:fk_empresa/:id", authenticateToken, deleteUser);

export default router;
