import { useState } from "react";
import { useDispatch } from "react-redux";
import { asyncCreateLostFound } from "../states/action";

export default function AddModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      if (typeof URL !== "undefined" && URL.createObjectURL) {
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      description,
      status,
    };
    if (cover) {
      payload.cover = cover;
    }

    const success = await dispatch(asyncCreateLostFound(payload));

    setLoading(false);
    if (success) {
      setTitle("");
      setDescription("");
      setStatus("lost");
      setCover(null);
      setPreview(null);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStatus("lost");
    setCover(null);
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-800">Buat Laporan Baru</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Barang
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kunci Motor Vario"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-blue-500"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori / Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-blue-500 bg-white"
            >
              <option value="lost">Kehilangan (Lost)</option>
              <option value="found">Ditemukan (Found)</option>
            </select>
          </div>

          <div>
            <label htmlFor="cover" className="block text-xs font-semibold text-slate-700 mb-1">
              Foto Barang (Opsional)
            </label>
            <input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {preview && (
              <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200">
                <img src={preview} alt="Pratinjau" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Detail
            </label>
            <textarea
              id="description"
              required
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ciri-ciri barang, lokasi terakhir dilihat, dll."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}