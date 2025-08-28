import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Blockchain() {
  const [blocks, setBlocks] = useState([]);

  const fetchBlocks = async () => {
    try {
      const res = await API.get("/blockchain");
      setBlocks(res.data);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération du ledger");
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">⛓ Blockchain Ledger</h2>

      <div className="relative border-l-2 border-blue-600 pl-6">
        {blocks.map((block, i) => (
          <div key={i} className="mb-8">
            {/* Point sur la timeline */}
            <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
              {block.index}
            </div>

            {/* Carte du bloc */}
            <div className="bg-white shadow-md p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-500">🕒 {block.timestamp}</p>
              <p className="font-semibold text-blue-700">{block.action}</p>
              <p className="text-xs text-gray-500">Hash: {block.hash}</p>
              <p className="text-xs text-gray-500">
                PrevHash: {block.previousHash}
              </p>

              {block.data && (
                <pre className="mt-2 p-2 bg-gray-100 text-xs rounded overflow-x-auto">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
