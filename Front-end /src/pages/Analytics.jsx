import { useEffect, useState } from "react";
import { getRevenue, getTopDatasets, getTopUsers, getStats } from "../api/analytics";

export default function Analytics() {
  const [revenue, setRevenue] = useState(null);
  const [topDatasets, setTopDatasets] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setRevenue((await getRevenue()).data);
      setTopDatasets((await getTopDatasets()).data);
      setTopUsers((await getTopUsers()).data);
      setStats((await getStats()).data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📈 Analytics</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">Revenu Total</h3>
          <p className="text-xl text-green-600">
            {revenue?.totalRevenue || 0} $
          </p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">Utilisateurs</h3>
          <p className="text-xl">{stats.users}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">Transactions</h3>
          <p className="text-xl">{stats.transactions}</p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">🔥 Top Datasets</h3>
      <ul className="mb-6">
        {topDatasets.map((ds, i) => (
          <li key={i} className="bg-gray-100 p-2 mb-2 rounded">
            Dataset #{ds.datasetId} - Ventes: {ds._count.datasetId} - Montant: {ds._sum.amount}
          </li>
        ))}
      </ul>

      <h3 className="font-semibold mb-2">👤 Top Acheteurs</h3>
      <ul>
        {topUsers.map((u, i) => (
          <li key={i} className="bg-gray-100 p-2 mb-2 rounded">
            User #{u.userId} - Achats: {u._count.userId} - Montant: {u._sum.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
