import express from "express";
import { cleanData, summarizeText } from "../controllers/aiController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/clean", authMiddleware, cleanData);
router.post("/summarize", authMiddleware, summarizeText);

export default router;
