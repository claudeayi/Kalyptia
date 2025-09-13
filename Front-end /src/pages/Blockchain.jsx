import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import API from "../api/axios";
import Loader from "../components/Loader";
import { useNotifications } from "../context/NotificationContext";

export default function Blockchain() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { addNotification } = useNotifications();

  // ✅ Récupération des blocs
  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/blockchain");
      setBlocks(res.data || []);
      setError("");
    } catch (err) {
      console.error("❌ Erreur récupération blockchain:", err);
      setError("Impossible de charger le ledger.");
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ WebSocket temps réel
  useEffect(() => {
    fetchBlocks();

    const token = localStorage.getItem("token");
    const socket = io("http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => console.log("✅ Socket blockchain connecté"));
    socket.on("disconnect", () => console.warn("⚠️ Socket blockchain déconnecté"));

    socket.on("NEW_BLOCK", (block) => {
      console.log("⚡ Nouveau bloc reçu:", block);
      setBlocks((prev) => [block, ...prev]);
      showToast("✅ Nouveau bloc ajouté !");

      addNotification({
        id: Date.now(),
        message: `⛓ Nouveau bloc ajouté : ${block.action || "inconnu"}`,
        type: "blockchain",
        timestamp: new Date(),
      });
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Copier avec feedback
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("📋 Copié dans le presse-papier !");
  };

  // ✅ Toast animé
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ✅ Export JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(blocks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blockchain-ledger.json";
    a.click();
    showToast("📤 Ledger exporté en JSON !");
  };

  // ✅ Export CSV
  const exportCSV = () => {
    const headers = ["Index", "Hash", "PrevHash", "Action", "Type", "Timestamp"];
    const rows = blocks.map((b) => [
      b.index,
      b.hash,
      b.previousHash,
      b.action,
      b.type,
      b.timestamp,
    ]);
    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blockchain-ledger.csv";
    a.click();
    showToast("📤 Ledger exporté en CSV !");
  };

  const typeIcons = {
    dataset: "📂",
    transaction: "💰",
    payment: "💳",
    default: "⛓",
  };

  // ✅ Filtrage & recherche
  const filteredBlocks = blocks.filter((b) => {
    const matchesFilter = filter === "all" || b.type === filter;
    const matchesSearch =
      !search ||
      b.hash?.toLowerCase().includes(search.toLowerCase()) ||
      b.action?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loader text="Chargement du ledger blockchain..." />;
  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  return (
    <div className="space-y-10">
      {/* ✅ Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50 text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Titre */}
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⛓ Blockchain Ledger
      </motion.h2>

      {/* Filtres & recherche */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {["all", "dataset", "transaction", "payment"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 text-sm rounded ${
                filter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {t === "all" ? "Tout" : t}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Rechercher hash/action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 text-sm border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Résumé stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded text-center">
          <h4 className="text-xs text-gray-500">Nombre de blocs</h4>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {blocks.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded text-center">
          <h4 className="text-xs text-gray-500">Dernier hash</h4>
          <p
            className="text-xs truncate cursor-pointer text-indigo-600 dark:text-indigo-400"
            title="Cliquez pour copier"
            onClick={() => copyToClipboard(blocks[0]?.hash || "")}
          >
            {blocks[0]?.hash || "—"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded text-center">
          <h4 className="text-xs text-gray-500">Dernière mise à jour</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={fetchBlocks}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🔄 Rafraîchir
        </button>
        <button
          onClick={exportJSON}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          📤 Export JSON
        </button>
        <button
          onClick={exportCSV}
          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          📤 Export CSV
        </button>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
        {filteredBlocks.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Aucun bloc trouvé...
          </p>
        )}

        {filteredBlocks.map((block, i) => (
          <motion.div
            key={block.hash || i}
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Point timeline */}
            <div className="absolute -left-3 w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">
              {block.index}
            </div>

            {/* Carte bloc */}
            <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  {typeIcons[block.type] || typeIcons.default} {block.action}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    block.index === 0
                      ? "bg-gray-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {block.index === 0 ? "Genesis" : "Validé"}
                </span>
              </div>

              {/* Infos principales */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                🕒 {block.timestamp}
              </p>
              <p
                className="text-xs text-gray-500 truncate cursor-pointer hover:underline"
                onClick={() => copyToClipboard(block.hash)}
                title="Copier le hash"
              >
                🔑 Hash: {block.hash}
              </p>
              <p
                className="text-xs text-gray-500 truncate cursor-pointer hover:underline"
                onClick={() => copyToClipboard(block.previousHash)}
                title="Copier le hash précédent"
              >
                ⬅ PrevHash: {block.previousHash}
              </p>

              {/* Données du bloc */}
              {block.data && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400">
                    Voir données
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto text-gray-800 dark:text-gray-200">
                    {JSON.stringify(block.data, null, 2)}
                  </pre>
                </details>
              )}

              {/* Si transactions */}
              {block.data?.transactions && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  📊 Transactions : {block.data.transactions.length}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
