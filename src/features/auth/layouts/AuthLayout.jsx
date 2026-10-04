import { Outlet, Navigate } from "react-router-dom";
import { getAccessToken } from "../../../helpers/apiHelper";

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          Delcom Lost & Founds
        </h2>
        <p className="mt-2 text-sm text-slate-700 font-medium">
          Aplikasi Pelaporan & Pencarian Barang Hilang
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-xl sm:px-10 border border-slate-200">
          <Outlet />
        </div>
      </div>
    </main>
  );
}