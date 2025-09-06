import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await register(form);
      localStorage.setItem("token", res.data.token);
      navigate("/datasets");
    } catch (err) {
      console.error("❌ Erreur inscription:", err);
      setError("❌ Impossible de créer le compte. Vérifiez vos infos.");
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return "Nom requis.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Email invalide.";
    if (form.password.length < 8) return "Mot de passe trop court (8+ caractères).";
    return null;
  };

  const progress = (step / 3) * 100;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-6">
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progression */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          🚀 Inscription Kalyptia
        </h1>

        {error && (
          <p className="text-red-500 bg-red-100 dark:bg-red-800/40 p-2 rounded text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Nom complet"
                  className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Mot de passe (8+ caractères)"
                  className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  onClick={() => {
                    const err = validateStep1();
                    if (err) setError(err);
                    else {
                      setError("");
                      nextStep();
                    }
                  }}
                >
                  Suivant ➡
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Choisissez votre rôle :
                </label>
                <select
                  className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="USER">Utilisateur Standard</option>
                  <option value="PREMIUM">Premium 🚀</option>
                </select>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
                  >
                    ⬅ Retour
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Suivant ➡
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  En créant un compte, vous acceptez nos{" "}
                  <a href="/terms" className="text-indigo-600 underline">
                    CGU
                  </a>{" "}
                  et notre{" "}
                  <a href="/privacy" className="text-indigo-600 underline">
                    Politique de Confidentialité
                  </a>.
                </p>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
                  >
                    ⬅ Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "⏳ Création..." : "✅ Créer mon compte"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
