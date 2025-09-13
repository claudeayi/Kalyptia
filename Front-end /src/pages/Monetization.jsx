import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Monetization() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        // 🔮 Mock → à remplacer par API.get("/dataops/datasets")
        const mock = [
          { id: 1, name: "Finance 2025", status: "draft", price: null },
          { id: 2, name: "Social Media Trends", status: "published", price: 99 },
        ];
        setDatasets(mock);
      } catch (err) {
        console.error("❌ Erreur datasets:", err);
        setMessage("❌ Impossible de charger vos datasets.");
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const handlePublish = async (datasetId) => {
    try {
      setMessage("");
      if (!price || isNaN(price)) {
        return setMessage("⚠️ Veuillez entrer un prix valide.");
      }

      // 🔮 Mock → remplacer par API.post(`/dataops/monetize/${datasetId}`, { price })
      console.log("💰 Publication dataset:", { datasetId, price });
      setDatasets((prev) =>
        prev.map((d) =>
          d.id === datasetId ? { ...d, status: "published", price } : d
        )
      );
      setSelected(null);
      setPrice("");
      setMessage("✅ Dataset publié avec succès !");
    } catch (err) {
      console.error("❌ Erreur publication:", err);
      setMessage("❌ Échec de la publication.");
    }
  };

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
        💰 Commercialisation des Données
      </h2>

      {loading && <Loader text="Chargement de vos datasets..." />}
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
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-4">
        {datasets.length === 0 ? (
          <p className="text-gray-500">Aucun dataset disponible.</p>
        ) : (
          <ul className="space-y-4">
            {datasets.map((d) => (
              <li
                key={d.id}
                className="p-4 border rounded-lg dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-xs text-gray-500">
                    Statut :{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-white text-xs ${
                        d.status === "published"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {d.status}
                    </span>
                  </p>
                  {d.price && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      💵 {d.price} $
                    </p>
                  )}
                </div>

                {d.status === "draft" ? (
                  <button
                    onClick={() => setSelected(d.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Publier
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
                    Déjà publié
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulaire de publication */}
      {selected && (
        <motion.div
          className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold">📦 Publier Dataset #{selected}</h3>
          <input
            type="number"
            placeholder="Prix en $"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={() => handlePublish(selected)}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            ✅ Confirmer la publication
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
