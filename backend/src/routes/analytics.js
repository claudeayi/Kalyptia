import express from "express";
import {
  getRevenue,
  getTopDatasets,
  getTopUsers,
  getStats,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * 📊 Analytics Routes – protégées par JWT
 */

// 💵 Chiffre d’affaires total
router.get("/revenue", authMiddleware, getRevenue);

// 📂 Top 5 datasets les plus vendus
router.get("/top-datasets", authMiddleware, getTopDatasets);

// 👥 Top 5 utilisateurs (meilleurs acheteurs/contributeurs)
router.get("/top-users", authMiddleware, getTopUsers);

// 📈 Statistiques globales (users, datasets, transactions)
router.get("/stats", authMiddleware, getStats);

export default router;
