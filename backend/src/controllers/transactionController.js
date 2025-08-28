import { PrismaClient } from "@prisma/client";
import { addBlock } from "../services/blockchainService.js"; // ✅ blockchain
import { sendNotification } from "../services/notificationService.js"; // ✅ notifications

const prisma = new PrismaClient();

// Acheter un dataset
export const buyDataset = async (req, res) => {
  try {
    const datasetId = parseInt(req.params.datasetId);
    const { amount, currency } = req.body;

    // Vérifier si le dataset existe
    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { owner: true }
    });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });

    // Créer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        datasetId: dataset.id,
        amount: amount || 10.0,
        currency: currency || "USD"
      }
    });

    // ✅ Log automatique dans la blockchain
    addBlock("DATASET_PURCHASED", {
      transactionId: transaction.id,
      datasetId: dataset.id,
      buyerId: req.user.id,
      sellerId: dataset.ownerId,
      amount: transaction.amount,
      currency: transaction.currency
    });

    // ✅ Notification temps réel (Socket.io)
    sendNotification(req.app, "DATASET_PURCHASED", {
      transactionId: transaction.id,
      datasetId: dataset.id,
      buyerId: req.user.id,
      sellerId: dataset.ownerId,
      amount: transaction.amount,
      currency: transaction.currency
    });

    res.json({
      message: "Transaction successful",
      transaction,
      dataset
    });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed", details: error.message });
  }
};

// Voir mes transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: { dataset: true }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch transactions", details: error.message });
  }
};
