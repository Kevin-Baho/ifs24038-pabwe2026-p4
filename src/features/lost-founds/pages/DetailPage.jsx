import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetLostFoundDetail,
  asyncUpdateLostFound,
  asyncDeleteLostFound,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const detail = useSelector((state) => state.lostFounds.detail);
  const profile = useSelector((state) => state.users.profile);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(asyncGetLostFoundDetail(id));
    }
  }, [id, dispatch]);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500 font-medium">Memuat detail laporan...</p>
      </div>
    );
  }

  const isOwner = Boolean(
    detail.is_me ||
    (profile && detail.user_id && detail.user_id === profile.id) ||
    (profile && detail.author?.id && detail.author.id === profile.id)
  );

  const handleToggleCompleted = () => {
    dispatch(
      asyncUpdateLostFound(detail.id, {
        title: detail.title,
        description: detail.description,
        status: detail.status,
        is_completed: !detail.is_completed,
      })
    );
  };

  const handleDelete = async () => {
    const confirmed = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus laporan ini?",
      "Hapus Laporan"
    );
    if (confirmed) {
      const success = await dispatch(asyncDeleteLostFound(detail.id));
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 gap-1"
        >
          &larr; Kembali ke Beranda
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleCompleted}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer ${
                detail.is_completed
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {detail.is_completed ? "Tandai Belum Selesai" : "Tandai Selesai"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover Section */}
        <div className="relative w-full bg-slate-100 h-64 md:h-80 flex items-center justify-center overflow-hidden">
          {detail.cover ? (
            <img
              src={detail.cover}
              alt={detail.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400 font-medium">Belum ada foto sampul</div>
          )}

          {isOwner && (
            <button
              type="button"
              onClick={() => setIsCoverOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur hover:bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg shadow cursor-pointer"
            >
              📷 Ganti Cover
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                detail.status === "lost"
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {detail.status === "lost" ? "Kehilangan" : "Ditemukan"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                detail.is_completed
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {detail.is_completed ? "Selesai / Terverifikasi" : "Dalam Proses Pencarian"}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {detail.title}
            </h1>
            <p className="text-xs text-slate-400">
              Dibuat: {formatDate(detail.created_at)}
              {detail.updated_at && ` • Diperbarui: ${formatDate(detail.updated_at)}`}
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
              Deskripsi
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {detail.description}
            </p>
          </div>

          {/* Author / Pelapor Info */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
              Informasi Pelapor
            </h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm overflow-hidden">
                {detail.author?.photo ? (
                  <img
                    src={detail.author.photo}
                    alt={detail.author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {detail.author?.name ? detail.author.name.charAt(0) : "P"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {detail.author?.name || "Anonim"}
                </p>
                <p className="text-xs text-slate-500">
                  {detail.author?.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangeModal
        item={detail}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <ChangeCoverModal
        itemId={detail.id}
        isOpen={isCoverOpen}
        onClose={() => setIsCoverOpen(false)}
      />
    </div>
  );
}

