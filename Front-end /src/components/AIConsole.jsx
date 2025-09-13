import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAI } from "../hooks/useAI";

export default function AIConsole() {
  const { askAI } = useAI();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // ✅ Scroll automatique en bas
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await askAI(input);
      setMessages((prev) => [...prev, { sender: "ai", text: res.data?.answer || "🤖 Je n’ai pas trouvé de réponse." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "❌ Erreur IA, réessaie plus tard." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir la console IA"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        🤖
      </button>

      {/* Console IA */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 90 }}
            className="fixed bottom-20 right-6 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <h3 className="font-semibold">💬 Copilot IA</h3>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-200"
              >
                ✖
              </button>
            </div>

            {/* Chat */}
            <div ref={chatRef} className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <p className="italic text-gray-500 dark:text-gray-400">⏳ L’IA réfléchit...</p>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex border-t border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez une question..."
                className="flex-1 p-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
