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
  const profile = useSelector((state) => state.users.profile);

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
      <div className="flex flex-1">
        <SidebarComponent />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

