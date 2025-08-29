import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    // Placeholder anomalies IA
    setAnomalies([
      { id: 1, type: "Paiement suspect", detail: "Montant inhabituel : 5000 USD via PayPal" },
      { id: 2, type: "Dataset incohérent", detail: "Dataset #12 contient des données manquantes" },
      { id: 3, type: "Tentative fraude", detail: "2 transactions annulées par Stripe" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚠ Anomalies détectées
      </motion.h2>

      <div className="space-y-4">
        {anomalies.map((a) => (
          <div
            key={a.id}
            className="bg-white dark:bg-gray-900 shadow p-4 rounded border-l-4 border-red-500"
          >
            <p className="font-semibold">{a.type}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{a.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
