import { Router } from "express";
import { generatePdf } from "../controllers/pdf-generator.controller.js";

const router = Router();

router.post("/pdf-generator/:fk_empresa", generatePdf);

export default router;
