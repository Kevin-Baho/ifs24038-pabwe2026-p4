import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  it("showSuccessDialog should call Swal.fire with default title", () => {
    showSuccessDialog("Operasi sukses");
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Berhasil!",
      text: "Operasi sukses",
      timer: 2000,
      showConfirmDialog: false,
    });
  });

  it("showSuccessDialog should call Swal.fire with custom title", () => {
    showSuccessDialog("Data disimpan", "Hebat!");
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Hebat!",
      text: "Data disimpan",
      timer: 2000,
      showConfirmDialog: false,
    });
  });

  it("showErrorDialog should call Swal.fire with default title", () => {
    showErrorDialog("Terjadi kegagalan");
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Gagal!",
      text: "Terjadi kegagalan",
    });
  });

  it("showErrorDialog should call Swal.fire with custom title", () => {
    showErrorDialog("Koneksi terputus", "Koneksi Error");
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Koneksi Error",
      text: "Koneksi terputus",
    });
  });

  it("showWarningDialog should call Swal.fire with default title", () => {
    showWarningDialog("Waspada");
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "warning",
      title: "Perhatian!",
      text: "Waspada",
    });
  });

  it("showWarningDialog should call Swal.fire with custom title", () => {
    showWarningDialog("Peringatan keras", "Hati-hati");
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "warning",
      title: "Hati-hati",
      text: "Peringatan keras",
    });
  });

  it("showConfirmDialog should return true when user confirms with default title", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    const result = await showConfirmDialog("Yakin ingin menghapus?");

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "question",
      title: "Konfirmasi Aksi",
      text: "Yakin ingin menghapus?",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    });
    expect(result).toBe(true);
  });

  it("showConfirmDialog should return false when user cancels with custom title", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    const result = await showConfirmDialog("Batalkan pesanan?", "Konfirmasi Pembatalan");

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "question",
      title: "Konfirmasi Pembatalan",
      text: "Batalkan pesanan?",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    });
    expect(result).toBe(false);
  });

  describe("formatDate", () => {
    it("should return '-' when dateString is empty or null or undefined", () => {
      expect(formatDate(null)).toBe("-");
      expect(formatDate(undefined)).toBe("-");
      expect(formatDate("")).toBe("-");
    });

    it("should format valid dateString correctly according to id-ID locale", () => {
      const formatted = formatDate("2026-05-15T10:30:00.000Z");
      expect(formatted).not.toBe("-");
      expect(typeof formatted).toBe("string");
      expect(formatted).toMatch(/2026/);
    });
  });
});

