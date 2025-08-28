import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAll = async (req, res) => {
  const datasets = await prisma.dataset.findMany({
    include: { owner: true }
  });
  res.json(datasets);
};

export const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const dataset = await prisma.dataset.create({
      data: {
        name,
        description,
        ownerId: req.user.id
      }
    });
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: "Dataset creation failed", details: error.message });
  }
};
