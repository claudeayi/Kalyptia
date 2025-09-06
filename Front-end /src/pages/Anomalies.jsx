import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Loader from "../components/Loader";

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        setLoading(true);
        const res = await API.get("/ai/anomalies");
        setAnomalies(res.data.anomalies || []);
      } catch (err) {
        console.warn("⚠️ Backend indisponible, fallback anomalies locales");
        setAnomalies([
          {
            id: 1,
            type: "Paiement suspect",
            detail: "Montant inhabituel : 5000 USD via PayPal",
            severity: "Haute",
            createdAt: new Date(),
          },
          {
            id: 2,
            type: "Dataset incohérent",
            detail: "Dataset #12 contient des données manquantes",
            severity: "Moyenne",
            createdAt: new Date(),
          },
          {
            id: 3,
            type: "Tentative fraude",
            detail: "2 transactions annulées par Stripe",
            severity: "Haute",
            createdAt: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  const typeColors = {
    Paiement: "bg-yellow-500",
    "Paiement suspect": "bg-yellow-500",
    Dataset: "bg-blue-500",
    "Dataset incohérent": "bg-blue-500",
    Fraude: "bg-red-600",
    "Tentative fraude": "bg-red-600",
  };

  const severities = {
    Haute: "bg-red-600 text-white",
    Moyenne: "bg-orange-500 text-white",
    Faible: "bg-green-500 text-white",
  };

  const handleResolve = (id) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAnomalies =
    filter === "all" ? anomalies : anomalies.filter((a) => a.type.includes(filter));

  if (loading) return <Loader text="Analyse des anomalies IA..." />;

  return (
    <div className="space-y-6">
      {/* Titre */}
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚠ Anomalies détectées
      </motion.h2>

      {/* Filtres */}
      <div className="flex gap-3">
        {["all", "Paiement", "Dataset", "Fraude"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {f === "all" ? "Tout" : f}
          </button>
        ))}
      </div>

      {/* Liste anomalies */}
      <div className="space-y-4">
        {filteredAnomalies.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">Aucune anomalie détectée.</p>
        )}

        {filteredAnomalies.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 shadow p-4 rounded border-l-4"
            style={{ borderColor: typeColors[a.type] || "#6B7280" }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{a.type}</p>
              {a.severity && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${severities[a.severity]}`}
                >
                  {a.severity}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{a.detail}</p>

            {a.createdAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🕒 {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: fr })}
              </p>
            )}

            <button
              onClick={() => handleResolve(a.id)}
              className="mt-3 text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ✅ Marquer comme résolu
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
