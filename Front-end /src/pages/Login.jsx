import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setError("⚠️ Veuillez remplir tous les champs.");
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await login(form);

      localStorage.setItem("token", res.data.token);

      setSuccess("✅ Connexion réussie, redirection en cours...");
      const redirectTo = location.state?.from?.pathname || "/datasets";
      setTimeout(() => navigate(redirectTo, { replace: true }), 1200);
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        err.response?.data?.error || "❌ Identifiants invalides, réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Titre */}
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          🔐 Connexion à Kalyptia
        </h1>

        {/* Messages */}
        {error && (
          <motion.div
            className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {success}
          </motion.div>
        )}

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="exemple@email.com"
            required
            aria-label="Adresse email"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value }) || setError("")
            }
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="********"
            required
            aria-label="Mot de passe"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value }) || setError("")
            }
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? "⏳ Connexion..." : "✅ Se connecter"}
        </button>

        {/* Liens */}
        <div className="mt-4 text-sm flex justify-between text-gray-600 dark:text-gray-300">
          <Link
            to="/register"
            className="hover:underline text-indigo-600 dark:text-indigo-400"
          >
            Pas encore de compte ?
          </Link>
          <Link
            to="/forgot-password"
            className="hover:underline text-indigo-600 dark:text-indigo-400"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
