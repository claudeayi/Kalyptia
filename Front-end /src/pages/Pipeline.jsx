import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Pipeline() {
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [operations, setOperations] = useState({
    deduplicate: false,
    normalize: false,
    anomalies: false,
    enrichAI: false,
  });
  const [loading, setLoading] = useState(false);
  const [pipelines, setPipelines] = useState([]);
  const [message, setMessage] = useState("");

  // 🔄 Charger les sources disponibles
  useEffect(() => {
    const fetchSources = async () => {
      try {
        // 🔮 Mock → remplacer par : const res = await API.get("/dataops/sources");
        const mock = [
          { id: 1, type: "web", detail: "https://example.com" },
          { id: 2, type: "api", detail: "API ••••••" },
        ];
        setSources(mock);
      } catch (err) {
        console.error("❌ Erreur récupération sources:", err);
      }
    };
    fetchSources();
  }, []);

  // 🚀 Lancer pipeline
  const handleRunPipeline = async (e) => {
    e.preventDefault();
    if (!selectedSource) {
      return setMessage("⚠️ Choisissez une source avant de lancer un pipeline.");
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        sourceId: selectedSource,
        operations: Object.keys(operations).filter((op) => operations[op]),
      };

      // 🔮 Mock → remplacer par : const res = await API.post("/dataops/pipeline", payload);
      const newPipeline = {
        id: Date.now(),
        source: sources.find((s) => s.id === parseInt(selectedSource)),
        ops: payload.operations,
        status: "running",
        date: new Date().toLocaleString(),
      };

      setPipelines((prev) => [newPipeline, ...prev]);

      // Simulation fin de traitement
      setTimeout(() => {
        setPipelines((prev) =>
          prev.map((p) =>
            p.id === newPipeline.id ? { ...p, status: "success" } : p
          )
        );
        setMessage("✅ Pipeline terminé avec succès !");
      }, 3000);
    } catch (err) {
      console.error("❌ Erreur lancement pipeline:", err);
      setMessage("❌ Échec du pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const operationLabels = {
    deduplicate: "🧹 Suppression doublons",
    normalize: "⚙️ Normalisation formats",
    anomalies: "⚠️ Détection anomalies",
    enrichAI: "🤖 Enrichissement IA",
  };

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        ⚙️ Pipeline – Nettoyage & Structuration
      </h2>

      {/* Formulaire pipeline */}
      <form
        onSubmit={handleRunPipeline}
        className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6"
      >
        {/* Choix source */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Sélectionnez une source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">-- Choisir une source --</option>
            {sources.map((src) => (
              <option key={src.id} value={src.id}>
                {src.type.toUpperCase()} – {src.detail}
              </option>
            ))}
          </select>
        </div>

        {/* Choix opérations */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Opérations</legend>
          {Object.entries(operationLabels).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={operations[key]}
                onChange={(e) =>
                  setOperations({ ...operations, [key]: e.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "⏳ Pipeline en cours..." : "🚀 Lancer le pipeline"}
        </button>
      </form>

      {/* Feedback */}
      {loading && <Loader text="Exécution du pipeline..." />}
      {message && (
        <p
          className={`p-3 rounded text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : message.startsWith("❌")
              ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
          }`}
        >
          {message}
        </p>
      )}

      {/* Historique pipelines */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h3 className="font-semibold mb-4">📜 Historique des pipelines</h3>
        {pipelines.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun pipeline exécuté pour l’instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {pipelines.map((p) => (
              <li
                key={p.id}
                className="p-3 rounded border dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">
                    {p.source.type.toUpperCase()} – {p.source.detail}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.ops.join(", ") || "Aucune opération"} • {p.date}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    p.status === "running"
                      ? "bg-yellow-500 text-white"
                      : p.status === "success"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
