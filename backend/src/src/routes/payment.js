import express from "express";
import { payWithStripe } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Paiement Stripe
router.post("/stripe", authMiddleware, payWithStripe);

export default router;
