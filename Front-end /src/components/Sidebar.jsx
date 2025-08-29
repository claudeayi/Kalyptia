
import { NavLink } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Line } from "react-chartjs-2"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function Sidebar() {
  const { notifications } = useNotifications();
  const [counts, setCounts] = useState({ datasets: 0, transactions: 0 });
  const [revenues, setRevenues] = useState([]);
  const [openAI, setOpenAI] = useState(false); // ✅ toggle IA Insights

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const ds = await API.get("/datasets");
        const tx = await API.get("/transactions");
        setCounts({
          datasets: ds.data.length,
          transactions: tx.data.length,
        });
      } catch (err) {
        console.error("❌ Erreur Sidebar counts:", err);
      }
    };

    const fetchRevenue = async () => {
      try {
        const res = await API.get("/analytics/revenue");
        setRevenues(res.data.history || []);
      } catch (err) {
        console.error("❌ Erreur Sidebar revenue:", err);
      }
    };

    fetchCounts();
    fetchRevenue();
  }, []);

  const links = [
    { to: "/", label: "🏠 Accueil" },
    { to: "/marketplace", label: "🛒 Marketplace" },
    { to: "/datasets", label: "📂 Datasets", badge: counts.datasets, color: "bg-blue-600" },
    { to: "/transactions", label: "💰 Transactions", badge: counts.transactions, color: "bg-green-600" },
    { to: "/payments", label: "💳 Paiements" },
    { to: "/analytics", label: "📈 Analytics" },
    { to: "/blockchain", label: "⛓ Blockchain" },
    { to: "/activity", label: "⚡ Activité" },
    { to: "/notifications", label: "🔔 Notifications", badge: notifications.length, color: "bg-red-600" },
    { to: "/profile", label: "👤 Profil" },
  ];

  const aiLinks = [
    { to: "/ai/suggestions", label: "📊 Suggestions IA" },
    { to: "/ai/anomalies", label: "⚠ Anomalies" },
    { to: "/ai/predictions", label: "🔮 Prédictions" },
  ];

  // ✅ Sparkline config
  const chartData = {
    labels: revenues.map((_, i) => i + 1),
    datasets: [
      {
        data: revenues,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <aside className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-60 min-h-screen p-4 flex flex-col justify-between">
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to} className="flex items-center justify-between">
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex-1 block px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>

            {/* ✅ Badge cockpit IA */}
            {link.badge !== undefined && link.badge > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full text-white ${
                  link.color || "bg-gray-500"
                }`}
              >
                {link.badge}
              </span>
            )}
          </li>
        ))}

        {/* ✅ Section IA Insights collapsible */}
        <li>
          <button
            onClick={() => setOpenAI(!openAI)}
            className="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span>🤖 IA Insights</span>
            <span>{openAI ? "▲" : "▼"}</span>
          </button>
          {openAI && (
            <ul className="ml-4 mt-2 space-y-2">
              {aiLinks.map((ai) => (
                <li key={ai.to}>
                  <NavLink
                    to={ai.to}
                    className={({ isActive }) =>
                      `block px-2 py-1 rounded text-sm ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-300 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    {ai.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      {/* ✅ Sparkline Analytics */}
      {revenues.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            📊 Revenus récents
          </p>
          <div className="h-16">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </aside>
  );
}
