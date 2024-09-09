import { Router } from "express";
import { executeSQL } from "../controllers/sql_execute.controller.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/execute_sql", executeSQL);

export default router;
