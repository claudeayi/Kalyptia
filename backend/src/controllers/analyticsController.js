import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Chiffre d’affaires total
export const getRevenue = async (req, res) => {
  try {
    const total = await prisma.transaction.aggregate({
      _sum: { amount: true }
    });
    res.json({ totalRevenue: total._sum.amount || 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch revenue", details: error.message });
  }
};

// Top datasets par ventes
export const getTopDatasets = async (req, res) => {
  try {
    const datasets = await prisma.transaction.groupBy({
      by: ["datasetId"],
      _sum: { amount: true },
      _count: { datasetId: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5
    });

    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top datasets", details: error.message });
  }
};

// Top utilisateurs acheteurs
export const getTopUsers = async (req, res) => {
  try {
    const users = await prisma.transaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      _count: { userId: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top users", details: error.message });
  }
};

// Statistiques générales
export const getStats = async (req, res) => {
  try {
    const users = await prisma.user.count();
    const datasets = await prisma.dataset.count();
    const transactions = await prisma.transaction.count();

    res.json({
      users,
      datasets,
      transactions
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats", details: error.message });
  }
};
