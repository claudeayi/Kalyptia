import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import datasetRoutes from "./routes/dataset.js";
import transactionRoutes from "./routes/transaction.js";
import aiRoutes from "./routes/ai.js";
import blockchainRoutes from "./routes/blockchain.js"; // ✅ ajout

const app = express();

app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "🚀 Welcome to Kalyptia Backend API" });
});

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/blockchain", blockchainRoutes); // ✅ ajout

export default app;
