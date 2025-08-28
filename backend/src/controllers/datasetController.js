import { PrismaClient } from "@prisma/client";
import { addBlock } from "../services/blockchainService.js"; // ✅ ajout

const prisma = new PrismaClient();

export const getAll = async (req, res) => {
  try {
    const datasets = await prisma.dataset.findMany({
      include: { owner: true }
    });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch datasets", details: error.message });
  }
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

    // ✅ Log automatique dans le ledger blockchain
    addBlock("DATASET_CREATED", {
      datasetId: dataset.id,
      ownerId: req.user.id,
      name: dataset.name
    });

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: "Dataset creation failed", details: error.message });
  }
};
