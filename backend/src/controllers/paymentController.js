import { createStripePayment } from "../services/paymentService.js";
import { createPayPalPayment } from "../services/paypalService.js";

// Stripe Payment
export const payWithStripe = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const clientSecret = await createStripePayment(amount, currency || "usd");
    res.json({ clientSecret });
  } catch (error) {
    res.status(500).json({ error: "Stripe payment failed", details: error.message });
  }
};

// PayPal Payment
export const payWithPayPal = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const payment = await createPayPalPayment(amount, currency || "USD");
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "PayPal payment failed", details: error.message });
  }
};
