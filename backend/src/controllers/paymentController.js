import { PrismaClient } from "@prisma/client";
import { createStripePayment } from "../services/paymentService.js";
import { createPayPalPayment } from "../services/paypalService.js";
import { createCinetPayPayment } from "../services/cinetpayService.js";
import { addBlock } from "../services/blockchainService.js"; // ✅ ledger

const prisma = new PrismaClient();

// Stripe Payment
export const payWithStripe = async (req, res) => {
  try {
    const { amount, currency, datasetId } = req.body;
    if (!amount || !datasetId) return res.status(400).json({ error: "Amount and datasetId are required" });

    const clientSecret = await createStripePayment(amount, currency || "usd");

    // ✅ Enregistrer transaction en base
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        datasetId,
        amount,
        currency: currency || "USD"
      }
    });

    // ✅ Blockchain log
    addBlock("PAYMENT_STRIPE", {
      transactionId: transaction.id,
      datasetId,
      userId: req.user.id,
      amount,
      currency
    });

    res.json({ clientSecret, transaction });
  } catch (error) {
    res.status(500).json({ error: "Stripe payment failed", details: error.message });
  }
};

// PayPal Payment
export const payWithPayPal = async (req, res) => {
  try {
    const { amount, currency, datasetId } = req.body;
    if (!amount || !datasetId) return res.status(400).json({ error: "Amount and datasetId are required" });

    const payment = await createPayPalPayment(amount, currency || "USD");

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        datasetId,
        amount,
        currency: currency || "USD"
      }
    });

    addBlock("PAYMENT_PAYPAL", {
      transactionId: transaction.id,
      datasetId,
      userId: req.user.id,
      amount,
      currency
    });

    res.json({ payment, transaction });
  } catch (error) {
    res.status(500).json({ error: "PayPal payment failed", details: error.message });
  }
};

// CinetPay (Mobile Money)
export const payWithCinetPay = async (req, res) => {
  try {
    const { amount, currency, description, datasetId } = req.body;
    if (!amount || !datasetId) return res.status(400).json({ error: "Amount and datasetId are required" });

    const result = await createCinetPayPayment(amount, currency || "XAF", description || "Kalyptia dataset");

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        datasetId,
        amount,
        currency: currency || "XAF"
      }
    });

    addBlock("PAYMENT_CINETPAY", {
      transactionId: transaction.id,
      datasetId,
      userId: req.user.id,
      amount,
      currency
    });

    res.json({ result, transaction });
  } catch (error) {
    res.status(500).json({ error: "CinetPay payment failed", details: error.message });
  }
};
