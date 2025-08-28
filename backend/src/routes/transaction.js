import express from "express";
import { buyDataset, getTransactions } from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Acheter un dataset
router.post("/buy/:datasetId", authMiddleware, buyDataset);

// Voir mes transactions
router.get("/", authMiddleware, getTransactions);

export default router;
