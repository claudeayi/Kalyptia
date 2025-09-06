import { useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      await API.post("/auth/forgot-password", { email });
      setMessage("✅ Email envoyé ! Vérifiez votre boîte de réception.");
    } catch (err) {
      console.error("❌ Erreur:", err);
      setMessage("❌ Impossible d’envoyer l’email. Réessayez.");
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
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          🔑 Mot de passe oublié
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
            type="email"
            placeholder="Votre email"
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "⏳ Envoi..." : "📩 Envoyer le lien"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
