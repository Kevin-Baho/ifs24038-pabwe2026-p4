import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetUsers } from "../states/action";

const DEFAULT_USERS = [];

export default function UsersPage() {
  const dispatch = useDispatch();
  const rawUsers = useSelector((state) => state.users?.users);
  const users = Array.isArray(rawUsers)
    ? rawUsers
    : rawUsers?.users || DEFAULT_USERS;

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Daftar Pengguna</h1>
        <p className="text-slate-700 text-sm">Lihat seluruh pengguna yang terdaftar di sistem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3 shadow-sm hover:border-blue-200 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 overflow-hidden shrink-0 border border-blue-200">
              {user.photo ? (
                <img src={user.photo} alt={user.name || "User"} className="h-full w-full object-cover" />
              ) : (
                <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm text-slate-900 truncate">{user.name || "Pengguna"}</h2>
              <p className="text-xs text-slate-700 truncate">{user.email || "-"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}