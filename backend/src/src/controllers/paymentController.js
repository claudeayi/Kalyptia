import { createStripePayment } from "../services/paymentService.js";

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
