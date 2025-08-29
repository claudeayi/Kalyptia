import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 📊 Revenus globaux
 */
export const getRevenue = async (req, res) => {
  try {
    const revenue = await prisma.transaction.aggregate({
      _sum: { amount: true },
    });

    res.json({ totalRevenue: revenue._sum.amount || 0 });
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération revenus", details: error.message });
  }
};

/**
 * 📂 Statistiques globales
 */
export const getStats = async (req, res) => {
  try {
    // Utilisateurs
    const users = await prisma.user.count({ where: { role: "USER" } });
    const premium = await prisma.user.count({ where: { role: "PREMIUM" } });
    const admin = await prisma.user.count({ where: { role: "ADMIN" } });

    // Datasets par statut
    const datasetsPending = await prisma.dataset.count({ where: { status: "PENDING" } });
    const datasetsApproved = await prisma.dataset.count({ where: { status: "APPROVED" } });
    const datasetsRejected = await prisma.dataset.count({ where: { status: "REJECTED" } });

    // Transactions
    const transactions = await prisma.transaction.count();

    res.json({
      users,
      premium,
      admin,
      datasetsPending,
      datasetsApproved,
      datasetsRejected,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération stats", details: error.message });
  }
};

/**
 * ⭐ Top datasets (les plus vendus)
 */
export const getTopDatasets = async (req, res) => {
  try {
    const topDatasets = await prisma.dataset.findMany({
      take: 5,
      orderBy: {
        transactions: { _count: "desc" },
      },
      include: {
        _count: { select: { transactions: true } },
        owner: true,
      },
    });

    res.json(topDatasets);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération top datasets", details: error.message });
  }
};

/**
 * 👥 Top utilisateurs (meilleurs acheteurs)
 */
export const getTopUsers = async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: { _count: "desc" },
      },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération top users", details: error.message });
  }
};
