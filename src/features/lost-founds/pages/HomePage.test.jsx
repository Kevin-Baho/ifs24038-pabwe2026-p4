import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import HomePage from "./HomePage";
import * as lostFoundAction from "../states/action";

function renderHomePage(initialLostFounds = [], dailyStats = null, monthlyStats = null) {
  const store = configureStore({
    reducer: {
      lostFounds: () => ({
        lostFounds: initialLostFounds,
        dailyStats,
        monthlyStats,
      }),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </Provider>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch items and stats on mount and display empty state when no items", () => {
    const getItemsSpy = vi
      .spyOn(lostFoundAction, "asyncGetLostFounds")
      .mockReturnValue(() => Promise.resolve());
    const getDailySpy = vi
      .spyOn(lostFoundAction, "asyncGetDailyStats")
      .mockReturnValue(() => Promise.resolve());
    const getMonthlySpy = vi
      .spyOn(lostFoundAction, "asyncGetMonthlyStats")
      .mockReturnValue(() => Promise.resolve());

    renderHomePage([]);

    expect(getItemsSpy).toHaveBeenCalled();
    expect(getDailySpy).toHaveBeenCalled();
    expect(getMonthlySpy).toHaveBeenCalled();
    expect(screen.getByText("Tidak ada laporan yang ditemukan.")).toBeInTheDocument();
  });

  it("should render items with stats, badges, and cover photo correctly", () => {
    const mockItems = [
      {
        id: 1,
        title: "Kunci Honda",
        description: "Gantungan kunci merah",
        status: "lost",
        is_completed: false,
        is_me: false,
        cover: "http://img.com/kunci.jpg",
        created_at: "2026-05-10T10:00:00Z",
      },
      {
        id: 2,
        title: "Kucing Putih",
        description: "Mata biru",
        status: "found",
        is_completed: true,
        is_me: true,
        cover: null,
        created_at: "2026-05-11T12:00:00Z",
      },
      {
        id: 3,
        title: null,
        description: null,
        status: "lost",
        is_completed: false,
        is_me: false,
        cover: null,
        created_at: null,
      },
    ];

    renderHomePage(mockItems, [{ day: 1 }], [{ month: "May" }]);

    expect(screen.getByText("Total Laporan")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // totalCount
    expect(screen.getByText("Kunci Honda")).toBeInTheDocument();
    expect(screen.getByText("Kucing Putih")).toBeInTheDocument();
    expect(screen.getByAltText("Kunci Honda")).toHaveAttribute("src", "http://img.com/kunci.jpg");
    expect(screen.getAllByText("Tidak ada foto").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Kehilangan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ditemukan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Selesai").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Statistik Harian: Aktif")).toBeInTheDocument();
    expect(screen.getByText("Statistik Bulanan: Aktif")).toBeInTheDocument();
  });

  it("should filter items by search query", () => {
    const mockItems = [
      { id: 1, title: "Jaket Hitam", description: "Bahan kulit", status: "lost" },
      { id: 2, title: "Sepatu Converse", description: "Warna putih", status: "found" },
      { id: 3, title: "Topi", description: null, status: "lost" },
    ];

    renderHomePage(mockItems);

    const searchInput = screen.getByPlaceholderText("Cari nama atau deskripsi...");
    
    // Search matching description
    fireEvent.change(searchInput, { target: { value: "kulit" } });
    expect(screen.getByText("Jaket Hitam")).toBeInTheDocument();
    expect(screen.queryByText("Sepatu Converse")).not.toBeInTheDocument();

    // Search matching title
    fireEvent.change(searchInput, { target: { value: "Sepatu" } });
    expect(screen.queryByText("Jaket Hitam")).not.toBeInTheDocument();
    expect(screen.getByText("Sepatu Converse")).toBeInTheDocument();

    // Search matching nothing (tests false branch of title and description, plus null description fallback)
    fireEvent.change(searchInput, { target: { value: "xyz-not-found" } });
    expect(screen.queryByText("Jaket Hitam")).not.toBeInTheDocument();
    expect(screen.queryByText("Sepatu Converse")).not.toBeInTheDocument();
    expect(screen.queryByText("Topi")).not.toBeInTheDocument();
  });

  it("should filter items by status, completion, and ownership", () => {
    const mockItems = [
      { id: 1, title: "Item 1", status: "lost", is_completed: false, is_me: true },
      { id: 2, title: "Item 2", status: "found", is_completed: true, is_me: false },
    ];

    renderHomePage(mockItems);

    const selects = screen.getAllByRole("combobox");
    const statusSelect = selects[0];
    const completedSelect = selects[1];
    const isMeSelect = selects[2];

    // Filter status = found
    fireEvent.change(statusSelect, { target: { value: "found" } });
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();

    // Reset status filter, test completed filter
    fireEvent.change(statusSelect, { target: { value: "all" } });
    fireEvent.change(completedSelect, { target: { value: "false" } });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();

    // Reset completed filter, test is_me filter
    fireEvent.change(completedSelect, { target: { value: "all" } });
    fireEvent.change(isMeSelect, { target: { value: "true" } });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();

    // isMe filter false
    fireEvent.change(isMeSelect, { target: { value: "false" } });
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("should open and close AddModal", () => {
    renderHomePage([]);

    const addBtn = screen.getByRole("button", { name: "+ Tambah Laporan" });
    fireEvent.click(addBtn);

    expect(screen.getByText("Buat Laporan Baru")).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: "Batal" });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText("Buat Laporan Baru")).not.toBeInTheDocument();
  });

  it("should handle null lostFounds gracefully", () => {
    renderHomePage(null);
    expect(screen.getByText("Tidak ada laporan yang ditemukan.")).toBeInTheDocument();
  });
});
