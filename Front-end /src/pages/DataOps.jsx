// src/pages/DataOps.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function DataOps() {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setLogs((prev) => [...prev, "⏳ Envoi du fichier..."]);

    try {
      const formData = new FormData();
      formData.append("dataset", file);

      // 🔮 Endpoint DataOps backend
      const res = await API.post("/dataops/clean", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLogs((prev) => [
        ...prev,
        "✅ Nettoyage terminé.",
        "📂 Colonnes détectées : " + (res.data.columns || []).join(", "),
        "⚡ Tags IA : " + (res.data.tags || []).join(", "),
        "🚀 Dataset enrichi et sauvegardé en base."
      ]);
    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, "❌ Erreur lors du traitement DataOps."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="space-y-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        🛠️ DataOps – Nettoyage & Enrichissement
      </h2>

      {/* Upload */}
      <input
        type="file"
        accept=".csv,.json,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 border rounded dark:bg-gray-800 dark:text-white"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "⏳ Traitement en cours..." : "🚀 Lancer DataOps"}
      </button>

      {/* Logs cockpit */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm h-60 overflow-y-auto">
        {logs.map((log, i) => (
          <p key={i} className="mb-1">{log}</p>
        ))}
      </div>
    </motion.div>
  );
}
