import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Storage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🔄 Charger datasets disponibles
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        // 🔮 Mock → remplacer par : const res = await API.get("/dataops/storage");
        const mock = [
          { id: 1, name: "Finance Transactions", size: "25 MB", format: "CSV", createdAt: "2025-09-10" },
          { id: 2, name: "Social Media Trends", size: "12 MB", format: "JSON", createdAt: "2025-09-11" },
        ];
        setDatasets(mock);
      } catch (err) {
        console.error("❌ Erreur chargement datasets:", err);
        setMessage("❌ Impossible de charger les datasets.");
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const handleDelete = async (id) => {
    try {
      // 🔮 Mock → remplacer par : await API.delete(`/dataops/storage/${id}`);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      setMessage("✅ Dataset supprimé avec succès.");
    } catch (err) {
      console.error("❌ Erreur suppression dataset:", err);
      setMessage("❌ Échec suppression dataset.");
    }
  };

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
        📂 Stockage & Catalogage
      </h2>

      {loading && <Loader text="Chargement des datasets..." />}
      {message && (
        <p
          className={`p-3 rounded text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {message}
        </p>
      )}

      {/* Liste datasets */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h3 className="font-semibold mb-4">📋 Datasets disponibles</h3>
        {datasets.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun dataset disponible.
          </p>
        ) : (
          <ul className="space-y-3">
            {datasets.map((d) => (
              <li
                key={d.id}
                className="p-4 rounded border dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-gray-500">
                    {d.size} • {d.format} • Créé le {d.createdAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/datasets/${d.id}`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
