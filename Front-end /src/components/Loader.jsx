import { motion } from "framer-motion";

export default function Loader({
  text = "Chargement...",
  fullscreen = false,
  size = 10,
  color = "border-indigo-500",
}) {
  return (
    <motion.div
      className={`flex items-center justify-center ${
        fullscreen ? "fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900" : "py-10"
      }`}
      role="status"
      aria-busy="true"
      aria-label={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Spinner */}
      <div
        className={`animate-spin h-${size} w-${size} border-4 ${color} border-t-transparent rounded-full`}
      ></div>

      {/* Texte */}
      <span
        className="ml-3 text-gray-600 dark:text-gray-300 font-medium"
        aria-live="polite"
      >
        {text}
      </span>
    </motion.div>
  );
}
