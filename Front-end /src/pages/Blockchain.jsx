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
      <h2 className="text-2xl font-bold mb-4">⛓ Blockchain Ledger</h2>

      <div className="space-y-4">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="bg-white p-4 shadow rounded border-l-4 border-blue-600"
          >
            <p className="text-sm text-gray-500">Index: {block.index}</p>
            <p className="text-sm text-gray-500">Timestamp: {block.timestamp}</p>
            <p className="text-sm text-gray-500">Action: {block.action}</p>
            <p className="text-sm text-gray-500">Hash: {block.hash}</p>
            <p className="text-sm text-gray-500">
              PreviousHash: {block.previousHash}
            </p>
            {block.data && (
              <pre className="mt-2 p-2 bg-gray-100 text-xs rounded overflow-x-auto">
                {JSON.stringify(block.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
