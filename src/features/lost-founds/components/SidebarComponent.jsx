import { NavLink } from "react-router-dom";

export default function SidebarComponent() {
  const navItems = [
    { to: "/", label: "Beranda", icon: "📋" },
    { to: "/users", label: "Pengguna", icon: "👥" },
    { to: "/profile", label: "Profil Saya", icon: "👤" },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block" aria-label="Bilah Samping Navigasi">
      <nav aria-label="Menu Utama" className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}