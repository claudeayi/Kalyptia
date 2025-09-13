import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Sources() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    type: "web",
    url: "",
    apiKey: "",
    file: null,
  });
  const [history, setHistory] = useState([]);

  // 🔄 Charger historique existant (mock backend DataOps)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 🔮 Remplacer par : const res = await API.get("/dataops/sources");
        const mock = [
          { id: 1, type: "web", detail: "https://example.com", status: "connected" },
          { id: 2, type: "api", detail: "API Key ••••••", status: "connected" },
        ];
        setHistory(mock);
      } catch (err) {
        console.error("❌ Erreur récupération sources:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      setLoading(true);

      const data = new FormData();
      data.append("type", form.type);
      if (form.url) data.append("url", form.url);
      if (form.apiKey) data.append("apiKey", form.apiKey);
      if (form.file) data.append("file", form.file);

      // 🔮 Mock → remplacer par : await API.post("/dataops/sources", data)
      const newSource = {
        id: Date.now(),
        type: form.type,
        detail:
          form.type === "file"
            ? form.file?.name
            : form.type === "api"
            ? "API Key ••••••"
            : form.url || "N/A",
        status: "connected",
      };

      setHistory((prev) => [newSource, ...prev]);
      setMessage("✅ Source connectée avec succès !");
    } catch (err) {
      console.error("❌ Erreur ajout source:", err);
      setMessage("❌ Impossible de connecter la source.");
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    web: "🌐 Web Scraping",
    api: "🔑 API",
    social: "📱 Réseaux Sociaux",
    file: "📂 Fichier Upload",
    darkweb: "🕶️ Dark Web",
  };

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        🌍 Collecte de Données – Sources
      </h2>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6"
      >
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type de source</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Champs conditionnels */}
        {form.type === "web" && (
          <input
            type="url"
            placeholder="https://exemple.com"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
        )}
        {form.type === "api" && (
          <input
            type="text"
            placeholder="Clé API"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            value={form.apiKey}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
            required
          />
        )}
        {form.type === "file" && (
          <div className="space-y-2">
            <input
              type="file"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              required
            />
            {form.file && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📂 {form.file.name} – {(form.file.size / 1024).toFixed(1)} Ko
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "⏳ Connexion..." : "✅ Connecter la source"}
        </button>
      </form>

      {/* Résultat */}
      {loading && <Loader text="Connexion à la source..." />}
      {message && (
        <motion.p
          key={message}
          className={`p-3 rounded text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.p>
      )}

      {/* Historique des sources connectées */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h3 className="font-semibold mb-4">📜 Sources connectées</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune source pour l’instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((src) => (
              <li
                key={src.id}
                className="p-3 rounded border dark:border-gray-700 flex justify-between items-center"
              >
                <span>
                  {typeLabels[src.type] || "❓"} – {src.detail}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    src.status === "connected"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {src.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
