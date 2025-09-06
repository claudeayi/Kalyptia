import { useEffect, useState } from "react";
import { getDatasets, createDataset } from "../api/dataset";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import API from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Loader from "../components/Loader";

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await getDatasets();
      setDatasets(res.data || []);
    } catch (err) {
      console.error("❌ Erreur récupération datasets:", err);
      setError("Impossible de récupérer les datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDataset(form);
      setForm({ name: "", description: "" });
      fetchDatasets();
    } catch (err) {
      console.error("❌ Erreur création dataset:", err);
    }
  };

  const copyJSON = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const filteredDatasets = datasets.filter((ds) => {
    return (
      (filter === "all" || ds.status === filter) &&
      (ds.name.toLowerCase().includes(search.toLowerCase()) ||
        ds.description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  if (loading) return <Loader text="Chargement des datasets..." />;
  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  return (
    <div className="space-y-6">
      {/* Titre */}
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📂 Mes Datasets ({filteredDatasets.length})
      </motion.h2>

      {/* Formulaire création dataset */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Nom"
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Créer
        </button>
      </form>

      {/* Filtres & recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "APPROVED", "PENDING", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Liste datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDatasets.map((ds) => (
          <motion.div
            key={ds.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 shadow p-4 rounded-lg border cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelected(ds)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ds.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ds.description}
                </p>
                <p className="text-xs text-gray-400">
                  👤 {ds.owner?.name || "N/A"}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  ds.status === "APPROVED"
                    ? "bg-green-500 text-white"
                    : ds.status === "REJECTED"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {ds.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <p className="text-gray-500 mt-6">Aucun dataset disponible...</p>
      )}

      {/* ✅ Modal de preview */}
      {selected && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-2xl w-full relative"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>

            {/* Titre */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {selected.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selected.description}
            </p>
            {selected.createdAt && (
              <p className="text-xs text-gray-400">
                📅 Créé {formatDistanceToNow(new Date(selected.createdAt), { addSuffix: true, locale: fr })}
              </p>
            )}

            {/* Aperçu graphique */}
            <div className="my-4">
              <h4 className="text-sm font-semibold mb-2">📊 Aperçu IA</h4>
              <Line
                data={{
                  labels: ["Col1", "Col2", "Col3", "Col4"],
                  datasets: [
                    {
                      label: "Valeurs simulées",
                      data: [12, 19, 7, 14],
                      borderColor: "#3B82F6",
                      backgroundColor: "rgba(59,130,246,0.3)",
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
              />
            </div>

            {/* JSON preview */}
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto max-h-40 relative">
              <button
                onClick={() => copyJSON(selected)}
                className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                📋 Copier
              </button>
              <pre>{JSON.stringify(selected, null, 2)}</pre>
            </div>

            {/* Suggestions IA */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded">
              <h4 className="font-semibold mb-2">🤖 Suggestions IA</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Traduire ce dataset pour augmenter la portée 🌍</li>
                <li>Optimiser la description pour plus d’attractivité 📈</li>
                <li>Proposer un échantillon gratuit pour attirer des acheteurs 🎁</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
                Acheter
              </button>
              <button
                onClick={() => API.post("/ai/clean", { text: selected.description })}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
              >
                🧹 Nettoyer IA
              </button>
              <button
                onClick={() => API.post("/ai/summarize", { text: selected.description })}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded"
              >
                📄 Résumer IA
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
