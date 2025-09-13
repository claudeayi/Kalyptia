import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération profil:", err);
        setError("Impossible de charger votre profil.");
      }
    };
    fetchProfile();
  }, []);

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );
  }

  if (!user) {
    return <p className="text-gray-600 dark:text-gray-400">⏳ Chargement du profil...</p>;
  }

  const roleColors = {
    USER: "bg-blue-500 text-white",
    PREMIUM: "bg-purple-600 text-white",
    ADMIN: "bg-red-600 text-white",
  };

  // ✅ Rapport IA personnalisé (mock avant backend IA)
  const aiReport = [
    `⚡ Vous êtes actif depuis ${new Date(user.createdAt).toLocaleDateString()}.`,
    `📂 Vous avez créé ${user.datasets?.length || 0} datasets.`,
    `💳 Vous avez effectué ${user.transactions?.length || 0} transactions.`,
    "💡 Optimisez vos descriptions pour +15% de visibilité.",
    "🚀 Passez en PREMIUM pour +30% de revenus potentiels.",
  ];

  const aiScore = Math.min(100, (user.datasets?.length || 0) * 10 + 40); // Score simulé

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Titre */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
        👤 Mon Profil
      </h2>

      {/* Carte Profil */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>

        {/* Infos */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold ${roleColors[user.role]}`}
            title={`Rôle actuel : ${user.role}`}
          >
            {user.role}
          </span>
        </div>

        {/* Action */}
        <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded">
          ✏️ Modifier
        </button>
      </motion.div>

      {/* Détails supplémentaires */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white">📅 Inscription</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white">📂 Datasets créés</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.datasets?.length || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white">💳 Transactions</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.transactions?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white">🕒 Dernière connexion</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
          </p>
        </div>
      </motion.div>

      {/* Activité récente */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white">🕒 Activité récente</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          {user.datasets?.slice(-3).map((d, i) => (
            <li key={i}>📂 Dataset créé : {d.name}</li>
          ))}
          {user.transactions?.slice(-3).map((t, i) => (
            <li key={i}>
              💳 Transaction #{t.id} — {t.amount} {t.currency}
            </li>
          ))}
          {(!user.datasets?.length && !user.transactions?.length) && (
            <li>Aucune activité récente...</li>
          )}
        </ul>
      </motion.div>

      {/* ✅ Rapport IA */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-2">🤖 Rapport IA personnalisé</h3>

        {/* Score IA */}
        <div className="mb-4">
          <p className="text-sm">Score d’optimisation profil</p>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full"
              style={{ width: `${aiScore}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1">⚡ {aiScore}/100</p>
        </div>

        <ul className="space-y-2">
          {aiReport.map((ins, i) => (
            <li key={i} className="bg-white bg-opacity-20 p-3 rounded text-sm">
              {ins}
            </li>
          ))}
        </ul>

        {/* Suggestion upgrade */}
        {user.role !== "PREMIUM" && (
          <div className="mt-4 p-3 bg-yellow-400 text-black rounded text-sm font-semibold">
            🚀 Passez en PREMIUM pour débloquer l’IA avancée et +30% revenus !
          </div>
        )}
      </motion.div>

      {/* Paramètres rapides */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl flex gap-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="flex-1 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
          🌙 Activer Dark Mode
        </button>
        <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          🔑 Changer mot de passe
        </button>
      </motion.div>
    </motion.div>
  );
}
