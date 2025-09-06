import { useState } from "react";
import API from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token"); // ✅ récupéré depuis l’URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      await API.post("/auth/reset-password", { token, password });
      setMessage("✅ Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Erreur reset:", err);
      setMessage("❌ Impossible de réinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-6">
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
          🔄 Réinitialisation du mot de passe
        </h1>

        {message && (
          <p
            className={`mb-4 p-2 rounded text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "⏳ Réinitialisation..." : "✅ Réinitialiser"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
