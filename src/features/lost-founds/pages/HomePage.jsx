import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  asyncGetLostFounds,
  asyncGetDailyStats,
  asyncGetMonthlyStats,
} from "../states/action";
import { formatDate } from "../../../helpers/toolsHelper";
import AddModal from "../modals/AddModal";

export default function HomePage() {
  const dispatch = useDispatch();
  const lostFounds = useSelector((state) => state.lostFounds?.lostFounds) || [];
  const dailyStats = useSelector((state) => state.lostFounds?.dailyStats);
  const monthlyStats = useSelector((state) => state.lostFounds?.monthlyStats);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [isMeFilter, setIsMeFilter] = useState("all");

  useEffect(() => {
    dispatch(asyncGetLostFounds());
    dispatch(asyncGetDailyStats());
    dispatch(asyncGetMonthlyStats());
  }, [dispatch]);

  const items = Array.isArray(lostFounds) ? lostFounds : [];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesCompleted =
      completedFilter === "all" ||
      String(Boolean(item.is_completed)) === completedFilter;

    const matchesIsMe =
      isMeFilter === "all" || String(Boolean(item.is_me)) === isMeFilter;

    return matchesSearch && matchesStatus && matchesCompleted && matchesIsMe;
  });

  const totalCount = items.length;
  const lostCount = items.filter((item) => item.status === "lost").length;
  const foundCount = items.filter((item) => item.status === "found").length;
  const completedCount = items.filter((item) => Boolean(item.is_completed)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Lost & Found</h1>
          <p className="text-sm text-slate-700">
            Temukan barang yang hilang atau laporkan barang yang Anda temukan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
          + Tambah Laporan
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Total Laporan</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-red-800 uppercase">Kehilangan</p>
          <p className="text-2xl font-black text-red-800 mt-1">{lostCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-800 uppercase">Ditemukan</p>
          <p className="text-2xl font-black text-emerald-800 mt-1">{foundCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-blue-800 uppercase">Selesai / Kembali</p>
          <p className="text-2xl font-black text-blue-800 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Daily & Monthly Stats */}
      {(dailyStats || monthlyStats) && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 flex flex-wrap gap-4 font-semibold">
          {dailyStats && <div>Statistik Harian: Aktif</div>}
          {monthlyStats && <div>Statistik Bulanan: Aktif</div>}
        </div>
      )}

      {/* Search and Filters Bar with Accessible Labels */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-sm">
        <div>
          <input
            type="text"
            aria-label="Cari nama atau deskripsi barang"
            placeholder="Cari nama atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <select
            aria-label="Filter Kategori Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Status</option>
            <option value="lost">Kehilangan</option>
            <option value="found">Ditemukan</option>
          </select>
        </div>
        <div>
          <select
            aria-label="Filter Progres Penyelesaian"
            value={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Progres</option>
            <option value="true">Selesai</option>
            <option value="false">Dalam Proses</option>
          </select>
        </div>
        <div>
          <select
            aria-label="Filter Kepemilikan Laporan"
            value={isMeFilter}
            onChange={(e) => setIsMeFilter(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Kepemilikan</option>
            <option value="true">Laporan Saya</option>
            <option value="false">Laporan Lain</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-800 font-bold">Tidak ada laporan yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-800 font-bold text-sm">Tidak ada foto</div>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === "lost"
                        ? "bg-red-800 text-white"
                        : "bg-emerald-800 text-white"
                    }`}
                  >
                    {item.status === "lost" ? "Kehilangan" : "Ditemukan"}
                  </span>
                  {Boolean(item.is_completed) && (
                    <span className="absolute top-3 right-3 bg-blue-800 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                      Selesai
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="font-bold text-slate-900 text-base line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-slate-800 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-200 flex items-center justify-between text-xs text-slate-800 mt-2 font-bold">
                <span>{formatDate(item.created_at)}</span>
                <Link
                  to={`/lost-founds/${item.id}`}
                  className="text-blue-800 font-bold hover:underline"
                >
                  Detail &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}