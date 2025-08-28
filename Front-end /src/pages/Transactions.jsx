import { useEffect, useState } from "react";
import { getMyTransactions } from "../api/transaction";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await getMyTransactions();
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">💰 Mes Transactions</h2>
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">#</th>
            <th className="p-2">Dataset</th>
            <th className="p-2">Montant</th>
            <th className="p-2">Devise</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="text-center border-t">
              <td className="p-2">{tx.id}</td>
              <td className="p-2">{tx.dataset?.name}</td>
              <td className="p-2">{tx.amount}</td>
              <td className="p-2">{tx.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
