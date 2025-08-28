import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import datasetRoutes from "./routes/dataset.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🚀 Welcome to Kalyptia Backend API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/datasets", datasetRoutes);

export default app;
