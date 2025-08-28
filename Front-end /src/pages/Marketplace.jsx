import { useEffect, useState } from "react";
import { getDatasets } from "../api/dataset";
import { buyDataset } from "../api/transaction";

export default function Marketplace() {
  const [datasets, setDatasets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await getDatasets();
      setDatasets(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("❌ Erreur récupération datasets:", err);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleBuy = async (datasetId) => {
    try {
      setMessage("");
      const res = await buyDataset(datasetId, { amount: 10, currency: "USD" });
      setMessage(`✅ Achat réussi: Transaction #${res.data.transaction.id}`);
    } catch (err) {
      setMessage("❌ Échec de l'achat");
    }
  };

  // Filtrage des datasets
  const filtered = datasets.filter(
    (ds) =>
      ds.name.toLowerCase().includes(search.toLowerCase()) ||
      (ds.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🛒 Marketplace des Datasets</h2>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher un dataset..."
        className="w-full p-2 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-gray-500">Chargement...</p>}
      {message && <p className="mb-4 text-sm">{message}</p>}

      {/* Liste datasets */}
      <div className="grid grid-cols-2 gap-6">
        {filtered.map((ds) => (
          <div
            key={ds.id}
            className="bg-white shadow p-4 rounded border flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">{ds.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{ds.description}</p>
              <p className="text-xs text-gray-500">
                Propriétaire: {ds.owner?.name || "N/A"}
              </p>
              <p className="text-xs text-gray-400">Status: {ds.status}</p>
            </div>
            <button
              onClick={() => handleBuy(ds.id)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Acheter (10 USD)
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-gray-500">Aucun dataset trouvé...</p>
      )}
    </div>
  );
}
