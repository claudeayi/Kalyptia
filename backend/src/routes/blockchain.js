import express from "express";
import { logAction, getAllBlocks } from "../controllers/blockchainController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ajouter un block (action + payload)
router.post("/add", authMiddleware, logAction);

// Consulter le ledger complet
router.get("/", authMiddleware, getAllBlocks);

export default router;
