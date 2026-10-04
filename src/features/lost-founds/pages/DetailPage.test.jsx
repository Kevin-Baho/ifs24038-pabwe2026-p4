import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DetailPage from "./DetailPage";
import * as lostFoundAction from "../states/action";
import * as toolsHelper from "../../../helpers/toolsHelper";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderDetailPage({ detail = null, profile = null, initialPath = "/lost-founds/1" } = {}) {
  const store = configureStore({
    reducer: {
      lostFounds: () => ({ detail }),
      users: () => ({ profile }),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/lost-founds/:id" element={<DetailPage />} />
          <Route path="/lost-founds" element={<DetailPage />} />
          <Route path="/" element={<div>Home Root</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("DetailPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  it("should show loading state when detail is null", () => {
    const getDetailSpy = vi
      .spyOn(lostFoundAction, "asyncGetLostFoundDetail")
      .mockReturnValue(() => Promise.resolve());

    renderDetailPage({ detail: null, initialPath: "/lost-founds/10" });

    expect(getDetailSpy).toHaveBeenCalledWith("10");
    expect(screen.getByText("Memuat detail laporan...")).toBeInTheDocument();
  });

  it("should not dispatch detail action if id param is missing", () => {
    const getDetailSpy = vi.spyOn(lostFoundAction, "asyncGetLostFoundDetail");

    renderDetailPage({ detail: null, initialPath: "/lost-founds" });

    expect(getDetailSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Memuat detail laporan...")).toBeInTheDocument();
  });

  it("should render item detail with full info, author photo, and updated_at date for non-owner", () => {
    const mockDetail = {
      id: 1,
      title: "Koper Hitam",
      description: "Berisi pakaian dan laptop",
      status: "lost",
      is_completed: false,
      is_me: false,
      cover: "http://img.com/koper.jpg",
      created_at: "2026-05-10T10:00:00Z",
      updated_at: "2026-05-11T12:00:00Z",
      author: {
        id: 99,
        name: "Charlie",
        email: "charlie@test.com",
        photo: "http://photo/charlie.jpg",
      },
    };

    renderDetailPage({ detail: mockDetail, profile: { id: 2 } });

    expect(screen.getByText("Koper Hitam")).toBeInTheDocument();
    expect(screen.getByText("Berisi pakaian dan laptop")).toBeInTheDocument();
    expect(screen.getByAltText("Koper Hitam")).toHaveAttribute("src", "http://img.com/koper.jpg");
    expect(screen.getByText("Kehilangan")).toBeInTheDocument();
    expect(screen.getByText("Dalam Proses Pencarian")).toBeInTheDocument();
    expect(screen.getByText(/Diperbarui:/)).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("charlie@test.com")).toBeInTheDocument();
    expect(screen.getByAltText("Charlie")).toHaveAttribute("src", "http://photo/charlie.jpg");

    // Owner action buttons should NOT be present
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hapus" })).not.toBeInTheDocument();
  });

  it("should render placeholder when cover and author details are missing", () => {
    const mockDetail = {
      id: 2,
      title: "Kacamata",
      description: "Frame hitam",
      status: "found",
      is_completed: true,
      is_me: false,
      cover: null,
      created_at: "2026-05-10T10:00:00Z",
      updated_at: null,
      author: null,
    };

    renderDetailPage({ detail: mockDetail, profile: null });

    expect(screen.getByText("Belum ada foto sampul")).toBeInTheDocument();
    expect(screen.getByText("Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Selesai / Terverifikasi")).toBeInTheDocument();
    expect(screen.getByText("Anonim")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("P")).toBeInTheDocument();
  });

  it("should enable owner actions when user_id matches profile id", () => {
    const mockDetail = {
      id: 3,
      title: "Helm KYT",
      description: "Warna biru",
      status: "found",
      is_completed: true,
      user_id: 10,
      author: null,
    };

    renderDetailPage({ detail: mockDetail, profile: { id: 10 } });

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hapus" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tandai Belum Selesai" })).toBeInTheDocument();
  });

  it("should enable owner actions when author.id matches profile id and handle completion toggle", () => {
    const updateSpy = vi
      .spyOn(lostFoundAction, "asyncUpdateLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const mockDetail = {
      id: 4,
      title: "Botol Minum",
      description: "Warna tosca",
      status: "lost",
      is_completed: false,
      is_me: false,
      author: { id: 15, name: "Doni", email: "doni@test.com" },
    };

    renderDetailPage({ detail: mockDetail, profile: { id: 15 } });

    const toggleBtn = screen.getByRole("button", { name: "Tandai Selesai" });
    fireEvent.click(toggleBtn);

    expect(updateSpy).toHaveBeenCalledWith(4, {
      title: "Botol Minum",
      description: "Warna tosca",
      status: "lost",
      is_completed: true,
    });
  });

  it("should open and close ChangeModal and ChangeCoverModal", () => {
    const mockDetail = {
      id: 5,
      title: "Jaket",
      description: "Jaket jeans",
      status: "lost",
      is_completed: false,
      is_me: true,
    };

    renderDetailPage({ detail: mockDetail, profile: null });

    // Open Edit modal
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByText("Edit Laporan")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByText("Edit Laporan")).not.toBeInTheDocument();

    // Open ChangeCover modal
    fireEvent.click(screen.getByRole("button", { name: "📷 Ganti Cover" }));
    expect(screen.getByText("Ubah Cover Gambar")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByText("Ubah Cover Gambar")).not.toBeInTheDocument();
  });

  it("should delete item when confirmed and navigate to /", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce(true);
    const deleteSpy = vi
      .spyOn(lostFoundAction, "asyncDeleteLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const mockDetail = {
      id: 6,
      title: "Tas Selempang",
      is_me: true,
    };

    renderDetailPage({ detail: mockDetail });

    const deleteBtn = screen.getByRole("button", { name: "Hapus" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith(6);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should not delete when confirm dialog is cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce(false);
    const deleteSpy = vi.spyOn(lostFoundAction, "asyncDeleteLostFound");

    const mockDetail = {
      id: 7,
      title: "Tas",
      is_me: true,
    };

    renderDetailPage({ detail: mockDetail });

    const deleteBtn = screen.getByRole("button", { name: "Hapus" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("should not navigate when delete fails", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce(true);
    vi.spyOn(lostFoundAction, "asyncDeleteLostFound").mockReturnValue(
      () => Promise.resolve(false)
    );

    const mockDetail = {
      id: 8,
      title: "Tas",
      is_me: true,
    };

    renderDetailPage({ detail: mockDetail });

    const deleteBtn = screen.getByRole("button", { name: "Hapus" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

