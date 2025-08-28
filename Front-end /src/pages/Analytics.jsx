import { useEffect, useState } from "react";
import { getRevenue, getTopDatasets, getTopUsers, getStats } from "../api/analytics";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function Analytics() {
  const [revenue, setRevenue] = useState(null);
  const [topDatasets, setTopDatasets] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRevenue((await getRevenue()).data);
        setTopDatasets((await getTopDatasets()).data);
        setTopUsers((await getTopUsers()).data);
        setStats((await getStats()).data);
      } catch (err) {
        console.error("❌ Erreur analytics:", err);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📈 Analytics</h2>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">💵 Revenu total</h3>
          <p className="text-2xl text-green-600">
            {revenue?.totalRevenue || 0} $
          </p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">👥 Utilisateurs</h3>
          <p className="text-2xl">{stats.users || 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">💰 Transactions</h3>
          <p className="text-2xl">{stats.transactions || 0}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-10">
        {/* Top Datasets */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="font-semibold mb-4">🔥 Top Datasets vendus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDatasets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datasetId" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="_sum.amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Acheteurs */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="font-semibold mb-4">👤 Top Acheteurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topUsers}
                dataKey="_sum.amount"
                nameKey="userId"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {topUsers.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
