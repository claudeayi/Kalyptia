import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération paramètres:", err);
        setError("Impossible de charger vos paramètres.");
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
    return <p className="text-gray-600 dark:text-gray-400">⏳ Chargement des paramètres...</p>;
  }

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Titre */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        ⚙️ Paramètres
      </h2>

      {/* Gestion compte */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">👤 Compte</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Email : {user.email}
        </p>
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
            ✏️ Modifier profil
          </button>
          <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded">
            🔑 Changer mot de passe
          </button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
            🗑 Supprimer compte
          </button>
        </div>
      </motion.div>

      {/* Préférences */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">🎨 Préférences</h3>
        <div className="flex items-center justify-between">
          <span>🌙 Mode sombre</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>🔔 Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="w-5 h-5"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            🌍 Langue
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </motion.div>

      {/* Abonnement & Paiements */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">💳 Abonnement</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Statut actuel :{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {user.role}
          </span>
        </p>
        {user.role !== "PREMIUM" ? (
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            🚀 Passer en PREMIUM
          </button>
        ) : (
          <p className="text-green-600 dark:text-green-400 font-semibold">
            ✅ Vous êtes PREMIUM
          </p>
        )}
      </motion.div>

      {/* Sécurité */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">🔐 Sécurité</h3>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded">
          Activer 2FA
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
          Déconnecter toutes les sessions
        </button>
      </motion.div>

      {/* Rapport IA */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-2">🤖 Analyse IA de vos paramètres</h3>
        <ul className="space-y-2 text-sm">
          <li>💡 Activez les notifications pour ne rien manquer.</li>
          <li>🌙 Le dark mode améliore la lecture prolongée.</li>
          <li>🚀 L’upgrade PREMIUM est recommandé pour booster vos revenus.</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
