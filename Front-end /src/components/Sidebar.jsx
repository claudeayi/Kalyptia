import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { to: "/", label: "🏠 Accueil" },
    { to: "/marketplace", label: "🛒 Marketplace" },
    { to: "/datasets", label: "📂 Datasets" },
    { to: "/transactions", label: "💰 Transactions" },
    { to: "/payments", label: "💳 Paiements" },
    { to: "/analytics", label: "📈 Analytics" },
    { to: "/ai", label: "🤖 IA" },
    { to: "/blockchain", label: "⛓ Blockchain" },
    { to: "/activity", label: "⚡ Activité" },
    { to: "/profile", label: "👤 Profil" },
  ];

  return (
    <aside className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-60 min-h-screen p-4">
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `block px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
