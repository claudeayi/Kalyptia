import express from "express";
import {
  getRevenue,
  getTopDatasets,
  getTopUsers,
  getStats
} from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Chiffre d’affaires total
router.get("/revenue", authMiddleware, getRevenue);

// Top 5 datasets
router.get("/top-datasets", authMiddleware, getTopDatasets);

// Top 5 utilisateurs acheteurs
router.get("/top-users", authMiddleware, getTopUsers);

// Stats globales
router.get("/stats", authMiddleware, getStats);

export default router;
