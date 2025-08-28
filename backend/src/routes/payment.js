import express from "express";
import { payWithStripe, payWithPayPal, payWithCinetPay } from "../controllers/paymentController.js"; // ✅ ajout
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Stripe
router.post("/stripe", authMiddleware, payWithStripe);

// PayPal
router.post("/paypal", authMiddleware, payWithPayPal);

// CinetPay (Mobile Money)
router.post("/cinetpay", authMiddleware, payWithCinetPay); // ✅ ajout

export default router;
