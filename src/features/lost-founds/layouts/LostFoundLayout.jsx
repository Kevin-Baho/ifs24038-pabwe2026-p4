import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../../../helpers/apiHelper";
import { asyncSetProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function LostFoundLayout() {
  const token = getAccessToken();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.users?.profile);

  useEffect(() => {
    if (token && !profile) {
      dispatch(asyncSetProfile());
    }
  }, [token, profile, dispatch]);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarComponent />
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <SidebarComponent />
        <main className="flex-1 min-w-0">
          <h1 style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
            Aplikasi Lost and Founds Delcom
          </h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
}