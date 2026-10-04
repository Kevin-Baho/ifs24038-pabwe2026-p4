import { useState } from "react";
import { useDispatch } from "react-redux";
import { asyncUploadCoverLostFound } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";

export default function ChangeCoverModal({ id, itemId, isOpen, onClose }) {
  const dispatch = useDispatch();
  const targetId = id || itemId;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (typeof URL !== "undefined" && URL.createObjectURL) {
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showErrorDialog("Silakan pilih file foto terlebih dahulu!");
      return;
    }

    setLoading(true);
    const success = await dispatch(asyncUploadCoverLostFound(targetId, file));
    setLoading(false);

    if (success) {
      setFile(null);
      setPreview(null);
      onClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-800">Ubah Cover Gambar</h2>
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
            <label htmlFor="cover-file" className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Foto Sampul Baru
            </label>
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {preview && (
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200">
              <img src={preview} alt="Pratinjau Sampul" className="w-full h-full object-cover" />
            </div>
          )}

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
              disabled={loading || !file}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mengunggah..." : "Unggah Cover"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}