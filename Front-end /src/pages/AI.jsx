import { useState } from "react";
import API from "../api/axios";

export default function AI() {
  const [input, setInput] = useState("");
  const [cleaned, setCleaned] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClean = async () => {
    setLoading(true);
    try {
      const res = await API.post("/ai/clean", { text: input });
      setCleaned(res.data.cleaned || JSON.stringify(res.data));
    } catch (err) {
      setCleaned("❌ Erreur lors du nettoyage");
    }
    setLoading(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await API.post("/ai/summarize", { text: input });
      setSummary(res.data.summary || JSON.stringify(res.data));
    } catch (err) {
      setSummary("❌ Erreur lors du résumé");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🤖 IA - Nettoyage & Résumé</h2>

      {/* Champ texte */}
      <textarea
        className="w-full h-40 p-3 border rounded mb-4"
        placeholder="Collez votre texte ici..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Boutons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleClean}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nettoyer
        </button>
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Résumer
        </button>
      </div>

      {/* Résultats */}
      {cleaned && (
        <div className="mb-6 bg-white shadow p-4 rounded">
          <h3 className="font-semibold mb-2">🧹 Texte nettoyé</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{cleaned}</pre>
        </div>
      )}

      {summary && (
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold mb-2">📌 Résumé</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
    </div>
  );
}
