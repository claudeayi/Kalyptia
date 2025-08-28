import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { to: "/", label: "🏠 Accueil" },
    { to: "/marketplace", label: "🛒 Marketplace" }, // ✅ nouveau
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
    <aside className="bg-gray-800 text-white w-60 min-h-screen p-4">
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"} // ✅ active uniquement sur l’accueil
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
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
