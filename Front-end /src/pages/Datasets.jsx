import { useEffect, useState } from "react";
import { getDatasets, createDataset } from "../api/dataset";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selected, setSelected] = useState(null);

  const fetchDatasets = async () => {
    try {
      const res = await getDatasets();
      setDatasets(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération datasets:", err);
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📂 Mes Datasets</h2>

      {/* Formulaire création dataset */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Nom"
          className="p-2 border rounded flex-1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded flex-1"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Créer
        </button>
      </form>

      {/* Liste datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {datasets.map((ds) => (
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
                    : "bg-yellow-500 text-white"
                }`}
              >
                {ds.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {datasets.length === 0 && (
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
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto max-h-40">
              <pre>{JSON.stringify(selected, null, 2)}</pre>
            </div>

            {/* Suggestions IA */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded">
              <h4 className="font-semibold mb-2">🤖 Suggestions IA</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Traduire ce dataset pour augmenter la portée 🌍</li>
                <li>Optimiser la description pour la rendre plus attractive 📈</li>
                <li>Proposer un échantillon gratuit pour attirer plus d’acheteurs 🎁</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
                Acheter
              </button>
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
                Nettoyer IA
              </button>
              <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded">
                Résumer IA
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
