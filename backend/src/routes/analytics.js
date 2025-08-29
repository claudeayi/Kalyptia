import express from "express";
import {
  getRevenue,
  getTopDatasets,
  getTopUsers,
  getStats,
  getAIInsights,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 💵 Chiffre d’affaires total
router.get("/revenue", authMiddleware, getRevenue);

// 📂 Top 5 datasets
router.get("/top-datasets", authMiddleware, getTopDatasets);

// 👥 Top 5 utilisateurs
router.get("/top-users", authMiddleware, getTopUsers);

// 📈 Statistiques globales
router.get("/stats", authMiddleware, getStats);

// 🤖 Insights IA dynamiques
router.get("/ai-insights", authMiddleware, getAIInsights);

export default router;
