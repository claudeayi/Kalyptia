import express from "express";
import { getAll, create } from "../controllers/datasetController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", authMiddleware, create);

export default router;
