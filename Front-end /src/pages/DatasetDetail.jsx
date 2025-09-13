import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function DatasetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Charger dataset + transactions liées
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/datasets/${id}`);
      setDataset(res.data);

      const tx = await API.get(`/transactions/dataset/${id}`);
      setTransactions(tx.data || []);

      // ✅ Récupérer suggestions IA
      try {
        const ai = await API.post("/ai/summarize", {
          text: res.data.description,
        });
        setAiSuggestions(ai.data?.insights || [
          "💡 Ajoutez plus de métadonnées pour améliorer la recherche.",
          "📊 Fournissez un exemple gratuit pour attirer de nouveaux acheteurs.",
          "🌍 Traduisez en anglais pour +20% d’adoption.",
        ]);
      } catch {
        setAiSuggestions([
          "💡 Ajoutez plus de métadonnées pour améliorer la recherche.",
          "📊 Fournissez un exemple gratuit pour attirer de nouveaux acheteurs.",
          "🌍 Traduisez en anglais pour +20% d’adoption.",
        ]);
      }
    } catch (err) {
      console.error("❌ Erreur fetch dataset:", err);
      setError("Impossible de charger ce dataset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(dataset, null, 2));
  };

  const exportCSV = () => {
    if (!dataset) return;
    const headers = ["id", "name", "description", "status"];
    const row = [dataset.id, dataset.name, dataset.description, dataset.status].join(",");
    const blob = new Blob([headers.join(",") + "\n" + row], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dataset_${dataset.id}.csv`;
    link.click();
  };

  if (loading) return <Loader text="Chargement du dataset..." />;
  if (error)
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          ⬅ Retour
        </button>
      </div>
    );

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow flex justify-between items-start"
      >
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            📂 {dataset.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {dataset.description}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            👤 {dataset.owner?.name || "Inconnu"} •{" "}
            {dataset.createdAt &&
              `Créé ${formatDistanceToNow(new Date(dataset.createdAt), {
                addSuffix: true,
                locale: fr,
              })}`}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm ${
            dataset.status === "APPROVED"
              ? "bg-green-500 text-white"
              : dataset.status === "REJECTED"
              ? "bg-red-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {dataset.status}
        </span>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Acheter
        </button>
        <button
          onClick={copyJSON}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          📋 Copier JSON
        </button>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          📊 Export CSV
        </button>
      </div>

      {/* Graphique dataset */}
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="font-semibold mb-3">📊 Analyse des données</h3>
        <Line
          data={{
            labels: ["Col1", "Col2", "Col3", "Col4"],
            datasets: [
              {
                label: "Valeurs simulées",
                data: [5, 15, 8, 20],
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59,130,246,0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          }}
        />
      </motion.div>

      {/* Transactions */}
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="font-semibold mb-3">💰 Transactions liées</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">Aucune transaction pour ce dataset.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="p-3 border rounded bg-gray-50 dark:bg-gray-800 text-sm"
              >
                <p>
                  <strong>Tx:</strong> #{tx.id} – {tx.amount} {tx.currency}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(tx.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Suggestions IA */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="font-semibold mb-3">🤖 Suggestions IA</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {aiSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
