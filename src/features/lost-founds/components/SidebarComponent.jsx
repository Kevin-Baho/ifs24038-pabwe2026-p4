import { NavLink } from "react-router-dom";

export default function SidebarComponent() {
  const navItems = [
    { to: "/", label: "Beranda", icon: "📋" },
    { to: "/users", label: "Pengguna", icon: "👥" },
    { to: "/profile", label: "Profil Saya", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:block shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
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

