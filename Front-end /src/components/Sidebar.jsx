// ... imports identiques

export default function Sidebar() {
  const { notifications } = useNotifications();
  const [counts, setCounts] = useState({ datasets: 0, transactions: 0 });
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAI, setOpenAI] = useState(false);
  const [openDataOps, setOpenDataOps] = useState(false); // ✅ nouveau

  // ... useEffect identique

  const links = [
    { to: "/", label: "🏠 Accueil" },
    { to: "/marketplace", label: "🛒 Marketplace" },
    {
      to: "/datasets",
      label: "📂 Datasets",
      badge: counts.datasets,
      color: "bg-blue-600",
    },
    {
      to: "/transactions",
      label: "💰 Transactions",
      badge: counts.transactions,
      color: "bg-green-600",
    },
    { to: "/payments", label: "💳 Paiements" },
    { to: "/analytics", label: "📈 Analytics" },
    { to: "/blockchain", label: "⛓ Blockchain" },
    { to: "/activity", label: "⚡ Activité" },
    {
      to: "/notifications",
      label: "🔔 Notifications",
      badge: notifications.length,
      color: "bg-red-600",
    },
    { to: "/profile", label: "👤 Profil" },
  ];

  const aiLinks = [
    { to: "/ai/suggestions", label: "📊 Suggestions IA" },
    { to: "/ai/anomalies", label: "⚠ Anomalies" },
    { to: "/ai/predictions", label: "🔮 Prédictions" },
  ];

  // ✅ Nouveaux liens DataOps
  const dataOpsLinks = [
    { to: "/dataops/pipelines", label: "🚚 Pipelines" },
    { to: "/dataops/cleaning", label: "🧹 Nettoyage" },
    { to: "/dataops/enrichment", label: "✨ Enrichissement" },
    { to: "/dataops/monitoring", label: "📡 Monitoring" },
  ];

  // ... chartData & variation identiques

  return (
    <aside
      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-64 min-h-screen p-4 flex flex-col justify-between shadow-lg border-r border-gray-200 dark:border-gray-700"
      role="navigation"
      aria-label="Menu latéral"
    >
      {/* Branding */}
      <div className="mb-6 flex items-center justify-between">
        <a
          href="/"
          className="text-lg font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        >
          🚀 Kalyptia
        </a>
        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white">
          v1.0
        </span>
      </div>

      {/* Navigation principale */}
      <ul className="space-y-3 flex-1">
        {links.map((link) => (
          <li key={link.to} className="flex items-center justify-between">
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex-1 block px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "hover:bg-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>
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

        {/* Section IA Insights */}
        <li>
          <button
            onClick={() => setOpenAI(!openAI)}
            aria-expanded={openAI}
            aria-controls="ai-insights"
            className="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition font-medium"
          >
            <span>🤖 IA Insights</span>
            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
              {openAI ? "▲" : "▼"} Beta
            </span>
          </button>
          <AnimatePresence>
            {openAI && (
              <motion.ul
                id="ai-insights"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-4 mt-2 space-y-2"
              >
                {aiLinks.map((ai) => (
                  <li key={ai.to}>
                    <NavLink
                      to={ai.to}
                      className={({ isActive }) =>
                        `block px-2 py-1 rounded text-sm transition ${
                          isActive
                            ? "bg-purple-600 text-white font-semibold"
                            : "hover:bg-gray-300 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      {ai.label}
                    </NavLink>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* ✅ Nouvelle Section DataOps */}
        <li>
          <button
            onClick={() => setOpenDataOps(!openDataOps)}
            aria-expanded={openDataOps}
            aria-controls="data-ops"
            className="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition font-medium"
          >
            <span>⚙️ DataOps</span>
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
              {openDataOps ? "▲" : "▼"} Pro
            </span>
          </button>
          <AnimatePresence>
            {openDataOps && (
              <motion.ul
                id="data-ops"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-4 mt-2 space-y-2"
              >
                {dataOpsLinks.map((d) => (
                  <li key={d.to}>
                    <NavLink
                      to={d.to}
                      className={({ isActive }) =>
                        `block px-2 py-1 rounded text-sm transition ${
                          isActive
                            ? "bg-green-600 text-white font-semibold"
                            : "hover:bg-gray-300 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      {d.label}
                    </NavLink>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      </ul>

      {/* Sparkline Analytics */}
      <div className="mt-6">
        {loading ? (
          <div className="animate-pulse h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        ) : revenues.length > 0 ? (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex justify-between items-center">
              <span>📊 Revenus récents</span>
              <span
                className={`ml-2 font-bold text-xs ${
                  variation > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {variation > 0 ? `+${variation}%` : `${variation}%`}
              </span>
            </p>
            <div className="h-16">
              <Line data={chartData} options={chartOptions} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Dernier revenu :{" "}
              <span className="font-semibold">
                {revenues[revenues.length - 1]} $
              </span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Aucune donnée disponible
          </p>
        )}
      </div>
    </aside>
  );
}
