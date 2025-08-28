import express from "express";
import { payWithStripe, payWithPayPal } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/stripe", authMiddleware, payWithStripe);
router.post("/paypal", authMiddleware, payWithPayPal); // ✅ ajout

export default router;
