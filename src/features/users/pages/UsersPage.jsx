import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetUsers } from "../states/action";

const DEFAULT_USERS = [];

export default function UsersPage() {
  const dispatch = useDispatch();
  const rawUsers = useSelector((state) => state.users?.users);
  const users = Array.isArray(rawUsers) ? rawUsers : DEFAULT_USERS;

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Daftar Pengguna</h1>
        <p className="text-slate-500 text-sm">Lihat seluruh pengguna yang terdaftar di sistem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden shrink-0">
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-slate-800 truncate">{user.name}</h4>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}