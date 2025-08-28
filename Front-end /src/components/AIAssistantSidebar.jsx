import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistantSidebar({ currentPage }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ Suggestions IA contextuelles (placeholder avant vrai backend IA)
  useEffect(() => {
    const contexts = {
      marketplace: [
        "💡 Le dataset financier #12 est en forte demande.",
        "🚀 Traduisez vos datasets en anglais pour +25% de ventes.",
        "⚠️ 2 datasets similaires au vôtre performent mieux, ajustez votre description."
      ],
      analytics: [
        "📊 Revenus en hausse de 10% cette semaine.",
        "⚡ Prévision IA : +30% d’ici 30 jours.",
        "💰 Catégorie 'finance' surperforme toutes les autres."
      ],
      profile: [
        "👤 Vous pourriez activer PREMIUM pour +50% opportunités.",
        "📂 Améliorez vos descriptions pour gagner +15% de visibilité.",
        "🚀 Votre profil a le potentiel de générer +40% ventes ce mois-ci."
      ],
      activity: [
        "⚡ Aujourd’hui : +3 datasets créés.",
        "💳 Paiements mobiles en hausse de 12%.",
        "📊 Les transactions sont plus fréquentes en soirée."
      ],
      default: [
        "🤖 Bienvenue dans Kalyptia – votre copilote data IA.",
        "💡 Explorez vos datasets pour maximiser vos revenus.",
        "📈 Consultez vos analytics pour détecter anomalies et opportunités."
      ]
    };

    setSuggestions(contexts[currentPage] || contexts.default);
  }, [currentPage]);

  return (
    <>
      {/* Bouton toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        🤖
      </button>

      {/* Sidebar flottant */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg p-6 z-40 flex flex-col"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              🤖 Assistant IA
            </h3>

            <ul className="space-y-3 flex-1 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-200 shadow"
                >
                  {s}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
