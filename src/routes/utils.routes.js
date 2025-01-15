import { Router } from "express";
import { getImageBase64 } from "../controllers/utils.controller.js";

const router = Router();

router.post("/utils/imageBase64", getImageBase64);

export default router;
