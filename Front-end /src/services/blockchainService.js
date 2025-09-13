import API from "../api/axios";
import { io } from "socket.io-client";

let socket = null;

/* ============================================================
 * 🌐 API REST
 * ============================================================ */

/** 📥 Récupérer tous les blocs */
export const getBlocks = async () => {
  const res = await API.get("/blockchain");
  return res.data || [];
};

/** 📥 Récupérer un bloc précis */
export const getBlockByHash = async (hash) => {
  const res = await API.get(`/blockchain/${hash}`);
  return res.data;
};

/** ➕ Ajouter un bloc (admin ou backend only) */
export const addBlock = async (data) => {
  const res = await API.post("/blockchain", data);
  return res.data;
};

/** 🔄 Rafraîchir */
export const refreshBlockchain = async () => {
  return await getBlocks();
};

/* ============================================================
 * ⚡ WebSocket temps réel
 * ============================================================ */

/**
 * Initialise le socket blockchain
 * @param {Function} onNewBlock callback quand un bloc arrive
 * @param {Function} onError callback erreur
 */
export const initBlockchainSocket = (onNewBlock, onError) => {
  if (socket) return socket;

  const token = localStorage.getItem("token");

  socket = io("http://localhost:5000", {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => console.log("✅ Socket blockchain connecté"));
  socket.on("disconnect", () => console.warn("⚠️ Socket blockchain déconnecté"));
  socket.on("connect_error", (err) => {
    console.error("❌ Erreur socket blockchain:", err);
    if (onError) onError(err);
  });

  socket.on("NEW_BLOCK", (block) => {
    console.log("⚡ Nouveau bloc:", block);
    if (onNewBlock) onNewBlock(block);
  });

  return socket;
};

/** ❌ Déconnexion propre */
export const closeBlockchainSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
