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

  getUsers
);
router.get("/users/:fk_empresa/:id", getUser);
router.put(
  "/users/:fk_empresa/email_update/:id",

  updateEmail
);
router.post("/users/:fk_empresa", createUser);
router.put("/users/:fk_empresa/:id", updateUser);
router.delete("/users/:fk_empresa/:id", deleteUser);

export default router;
