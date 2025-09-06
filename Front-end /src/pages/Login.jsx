import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
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
      const res = await login(form);

      localStorage.setItem("token", res.data.token);

      // 🔑 Redirige vers la page initiale ou datasets par défaut
      const redirectTo = location.state?.from?.pathname || "/datasets";
      navigate(redirectTo, { replace: true });
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
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          🔐 Connexion à Kalyptia
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Champ email */}
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          placeholder="exemple@email.com"
          required
          aria-label="Adresse email"
          className="w-full mb-4 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value }) || setError("")
          }
        />

        {/* Champ mot de passe */}
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Mot de passe
        </label>
        <input
          type="password"
          placeholder="********"
          required
          aria-label="Mot de passe"
          className="w-full mb-4 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value }) || setError("")
          }
        />

        {/* Bouton connexion */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "⏳ Connexion..." : "Se connecter"}
        </button>

        {/* Liens complémentaires */}
        <div className="mt-4 text-sm flex justify-between text-gray-600 dark:text-gray-300">
          <Link to="/register" className="hover:underline text-indigo-600 dark:text-indigo-400">
            Pas encore de compte ?
          </Link>
          <Link to="/forgot-password" className="hover:underline text-indigo-600 dark:text-indigo-400">
            Mot de passe oublié ?
          </Link>
        </div>
      </form>
    </div>
  );
}
