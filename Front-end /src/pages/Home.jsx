import { useEffect, useState } from "react";
import { getRevenue, getStats } from "../api/analytics";
import { io } from "socket.io-client";
import { Line } from "react-chartjs-2";

export default function Home() {
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRevenue((await getRevenue()).data.totalRevenue);
        setStats((await getStats()).data);
      } catch (err) {
        console.error("❌ Erreur Home Dashboard:", err);
      }
    };
    fetchData();

    // Socket.io pour activité live
    const socket = io("http://localhost:5000");
    socket.on("DATASET_CREATED", (data) =>
      setActivity((prev) => [
        { type: "dataset", message: `Dataset ${data.name} créé`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );
    socket.on("DATASET_PURCHASED", (data) =>
      setActivity((prev) => [
        { type: "transaction", message: `Dataset #${data.datasetId} acheté`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );
    socket.on("PAYMENT_SUCCESS", (data) =>
      setActivity((prev) => [
        { type: "payment", message: `Paiement ${data.amount} ${data.currency}`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );

    return () => socket.disconnect();
  }, []);

  // Exemple graphique d’évolution du revenu (fake data pour l’instant)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenu ($)",
        data: [500, 1200, 900, 1800, revenue], // dernière valeur = revenu actuel
        borderColor: "#3B82F6",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🚀 Tableau de Bord Global</h2>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">💵 Revenu total</h3>
          <p className="text-2xl text-green-600">{revenue} $</p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">👥 Utilisateurs</h3>
          <p className="text-2xl">{stats.users || 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">📂 Datasets</h3>
          <p className="text-2xl">{stats.datasets || 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded text-center">
          <h3 className="font-semibold">💰 Transactions</h3>
          <p className="text-2xl">{stats.transactions || 0}</p>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white shadow p-6 rounded mb-10">
        <h3 className="font-semibold mb-4">📊 Évolution des revenus</h3>
        <Line data={chartData} />
      </div>

      {/* Activité récente */}
      <div className="bg-white shadow p-6 rounded">
        <h3 className="font-semibold mb-4">⚡ Activité récente</h3>
        {activity.slice(0, 5).map((event, i) => (
          <div key={i} className="border-b py-2">
            <p className="text-sm">{event.time} — {event.message}</p>
          </div>
        ))}
        {activity.length === 0 && <p className="text-gray-500">Aucune activité pour l’instant...</p>}
      </div>
    </div>
  );
}
