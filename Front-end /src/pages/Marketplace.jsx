import { useEffect, useState } from "react";
import { getDatasets } from "../api/dataset";
import { payWithStripe, payWithPayPal, payWithCinetPay } from "../api/payment";
import { motion } from "framer-motion";

export default function Marketplace() {
  const [datasets, setDatasets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [selected, setSelected] = useState(null);

  // 🔄 Charger datasets
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await getDatasets();
      setDatasets(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // ❤️ Favoris (localStorage)
  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid) => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 💳 Paiements
  const handlePayment = async (method, datasetId, amount) => {
    try {
      setMessage("");
      let res;
      if (method === "stripe") {
        res = await payWithStripe({ datasetId, amount, currency: "USD" });
      } else if (method === "paypal") {
        res = await payWithPayPal({ datasetId, amount, currency: "USD" });
      } else if (method === "cinetpay") {
        res = await payWithCinetPay({
          datasetId,
          amount,
          currency: "XAF",
          description: "Achat dataset Kalyptia",
        });
      }
      setMessage(`✅ Paiement réussi via ${method.toUpperCase()} : Transaction #${res.data.transaction.id}`);
    } catch (err) {
      setMessage(`❌ Paiement ${method} échoué`);
    }
  };

  // 🔎 Filtres
  const filtered = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(search.toLowerCase()) ||
      (ds.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || ds.status === statusFilter;
    const matchesOwner =
      ownerFilter === "" || (ds.owner?.name || "").toLowerCase().includes(ownerFilter.toLowerCase());
    const matchesPrice =
      priceFilter === "" || parseFloat(priceFilter) <= (ds.price || 10);
    return matchesSearch && matchesStatus && matchesOwner && matchesPrice;
  });

  // 🤖 IA Insights (placeholder, mock)
  const getAIInsights = (dataset) => {
    return {
      score: Math.floor(Math.random() * 100),
      insights: [
        "💡 Qualité des données : bonne, mais 8% de valeurs manquantes détectées.",
        "📊 Potentiel de marché élevé : forte demande en datasets similaires.",
        "🚀 Recommandation : enrichir avec métadonnées pour +20% ventes."
      ],
      prediction: `Ce dataset pourrait générer environ ${Math.floor(Math.random() * 500) + 100}$ dans le prochain mois.`
    };
  };

  return (
    <div className="space-y-10">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent dark:from-green-300 dark:to-blue-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛒 Marketplace des Datasets
      </motion.h2>

      {/* 🔍 Filtres */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          className="p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Tous</option>
          <option value="PENDING">⏳ Pending</option>
          <option value="APPROVED">✅ Approved</option>
          <option value="REJECTED">❌ Rejected</option>
        </select>
        <input
          type="text"
          placeholder="👤 Propriétaire"
          className="p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="💵 Prix max"
          className="p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Chargement...</p>}
      {message && <p className="mb-4 text-sm">{message}</p>}

      {/* 🗂️ Liste datasets */}
      <div className="grid grid-cols-2 gap-6">
        {filtered.map((ds) => (
          <motion.div
            key={ds.id}
            className="bg-white dark:bg-gray-900 shadow p-4 rounded border dark:border-gray-700 flex flex-col justify-between"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{ds.name}</h3>
                <button
                  onClick={() => toggleFavorite(ds.id)}
                  className={`text-xl ${favorites.includes(ds.id) ? "text-red-500" : "text-gray-400"}`}
                >
                  ♥
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{ds.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">👤 {ds.owner?.name || "N/A"}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelected(ds)}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
              >
                Aperçu
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-gray-500 dark:text-gray-400">Aucun dataset trouvé...</p>
      )}

      {/* 🔎 Modal Aperçu + IA widget */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-lg w-full relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{selected.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{selected.description}</p>

            {/* ✅ Widget IA */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg shadow mb-4">
              <h4 className="font-semibold mb-2">🤖 Analyse IA</h4>
              {(() => {
                const ai = getAIInsights(selected);
                return (
                  <>
                    {/* Score */}
                    <div className="mb-2">
                      <p className="text-sm">Score Qualité :</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{ width: `${ai.score}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">⚡ {ai.score}/100</p>
                    </div>

                    {/* Insights */}
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {ai.insights.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ul>

                    {/* Prévision */}
                    <p className="text-sm mt-2 italic">{ai.prediction}</p>
                  </>
                );
              })()}
            </div>

            {/* Paiements */}
            <div className="flex gap-2">
              <button
                onClick={() => handlePayment("stripe", selected.id, 10)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Stripe
              </button>
              <button
                onClick={() => handlePayment("paypal", selected.id, 10)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              >
                PayPal
              </button>
              <button
                onClick={() => handlePayment("cinetpay", selected.id, 10)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                CinetPay
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
