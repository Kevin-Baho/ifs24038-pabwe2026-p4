import Swal from "sweetalert2";

export function showSuccessDialog(message, title = "Berhasil!") {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    timer: 2000,
    showConfirmDialog: false,
  });
}

export function showErrorDialog(message, title = "Gagal!") {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
  });
}

export function showWarningDialog(message, title = "Perhatian!") {
  return Swal.fire({
    icon: "warning",
    title,
    text: message,
  });
}

export async function showConfirmDialog(message, title = "Konfirmasi Aksi") {
  const result = await Swal.fire({
    icon: "question",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Ya, lanjutkan",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}