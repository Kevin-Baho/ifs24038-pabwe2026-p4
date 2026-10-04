import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { asyncLogout } from "../../auth/states/action";

export default function NavbarComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.users?.profile);

  const handleLogout = () => {
    dispatch(asyncLogout());
    navigate("/auth/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <nav aria-label="Navigasi Utama" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                LF
              </span>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight hidden sm:inline">
                Lost & Founds
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 text-slate-900 hover:text-blue-700">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 overflow-hidden text-sm border border-blue-200">
                {profile?.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {profile?.name || "Pengguna"}
                </p>
                <p className="text-xs text-slate-600 leading-tight">
                  {profile?.email || ""}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors cursor-pointer border border-red-200"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}