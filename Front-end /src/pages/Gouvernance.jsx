import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Governance() {
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGovernance = async () => {
      try {
        // 🔮 Mock → remplacer par des vraies API : 
        // const rulesRes = await API.get("/dataops/governance/rules");
        // const logsRes = await API.get("/dataops/governance/logs");

        const rulesMock = [
          { id: 1, role: "ADMIN", dataset: "Finance2025", access: "Lecture/Écriture" },
          { id: 2, role: "USER", dataset: "Social Trends", access: "Lecture seule" },
        ];
        const logsMock = [
          { id: 1, action: "Consultation dataset Finance2025", user: "Alice", date: "2025-09-11" },
          { id: 2, action: "Export dataset Social Trends", user: "Bob", date: "2025-09-10" },
        ];

        setRules(rulesMock);
        setLogs(logsMock);
      } catch (err) {
        console.error("❌ Erreur gouvernance:", err);
        setMessage("❌ Impossible de charger les règles de gouvernance.");
      } finally {
        setLoading(false);
      }
    };
    fetchGovernance();
  }, []);

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
        📜 Gouvernance & Conformité
      </h2>

      {loading && <Loader text="Chargement des règles de gouvernance..." />}
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

      {/* ✅ Règles d’accès */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h3 className="font-semibold mb-4">🔑 Règles d’accès</h3>
        {rules.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune règle définie.
          </p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-2">Rôle</th>
                <th className="p-2">Dataset</th>
                <th className="p-2">Accès</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b dark:border-gray-700">
                  <td className="p-2 font-medium">{r.role}</td>
                  <td className="p-2">{r.dataset}</td>
                  <td className="p-2">{r.access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Journal d’audit */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h3 className="font-semibold mb-4">📊 Journal d’audit</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun log disponible.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {logs.map((l) => (
              <li
                key={l.id}
                className="p-3 rounded border dark:border-gray-700 flex justify-between"
              >
                <span>{l.action}</span>
                <span className="text-xs text-gray-500">
                  {l.user} • {l.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
