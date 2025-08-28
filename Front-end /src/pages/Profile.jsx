import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération profil:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement du profil...</p>;
  }

  const roleColors = {
    USER: "bg-blue-500 text-white",
    PREMIUM: "bg-purple-600 text-white",
    ADMIN: "bg-red-600 text-white",
  };

  // ✅ Insights IA personnalisés (placeholder avant backend IA)
  const aiReport = [
    `⚡ Vous êtes actif depuis ${new Date(user.createdAt).toLocaleDateString()}.`,
    `📂 Vous avez créé ${user.datasets?.length || 0} datasets.`,
    "💡 Recommandation : améliorez vos descriptions pour +15% de visibilité.",
    "🚀 Votre profil pourrait générer +30% de ventes si vous activez le mode PREMIUM.",
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Titre */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent dark:from-pink-300 dark:to-red-400">
        👤 Mon Profil
      </h2>

      {/* Carte Profil */}
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl flex items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Infos */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold ${roleColors[user.role]}`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Détails supplémentaires */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white">📅 Date d’inscription</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white">📂 Datasets créés</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.datasets?.length || 0}</p>
        </div>
      </div>

      {/* ✅ Rapport IA */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Rapport IA personnalisé</h3>
        <ul className="space-y-2">
          {aiReport.map((ins, i) => (
            <li
              key={i}
              className="bg-white bg-opacity-20 p-3 rounded text-sm"
            >
              {ins}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
