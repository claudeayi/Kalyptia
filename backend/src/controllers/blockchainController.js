import { addBlock, getLedger } from "../services/blockchainService.js";

// Enregistrer un nouvel événement dans la blockchain
export const logAction = (req, res) => {
  const { action, payload } = req.body;
  const block = addBlock(action, payload);
  res.json({ message: "Action enregistrée dans le ledger", block });
};

// Récupérer tout le ledger
export const getAllBlocks = (req, res) => {
  res.json(getLedger());
};
