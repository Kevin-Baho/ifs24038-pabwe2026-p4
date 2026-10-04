import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddModal from "./AddModal";
import * as lostFoundAction from "../states/action";

function renderAddModal({ isOpen = true, onClose = vi.fn() }) {
  const store = configureStore({
    reducer: {
      lostFounds: (state = {}) => state,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <AddModal isOpen={isOpen} onClose={onClose} />
      </Provider>
    ),
    onClose,
  };
}

describe("AddModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    renderAddModal({ isOpen: false });
    expect(screen.queryByText("Buat Laporan Baru")).not.toBeInTheDocument();
  });

  it("should render modal form elements when isOpen is true", () => {
    renderAddModal({ isOpen: true });

    expect(screen.getByText("Buat Laporan Baru")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contoh: Kunci Motor Vario")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ciri-ciri barang/)).toBeInTheDocument();
  });

  it("should handle input changes and submit successfully", async () => {
    const createSpy = vi
      .spyOn(lostFoundAction, "asyncCreateLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const { onClose } = renderAddModal({ isOpen: true });

    const titleInput = screen.getByPlaceholderText("Contoh: Kunci Motor Vario");
    const statusSelect = screen.getByRole("combobox");
    const descInput = screen.getByPlaceholderText(/Ciri-ciri barang/);
    const submitBtn = screen.getByRole("button", { name: "Kirim Laporan" });

    fireEvent.change(titleInput, { target: { value: "Dompet Kulit" } });
    fireEvent.change(statusSelect, { target: { value: "found" } });
    fireEvent.change(descInput, { target: { value: "Ditemukan di kantin" } });
    fireEvent.click(submitBtn);

    expect(createSpy).toHaveBeenCalledWith({
      title: "Dompet Kulit",
      status: "found",
      description: "Ditemukan di kantin",
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not reset or close modal when create fails", async () => {
    const createSpy = vi.spyOn(lostFoundAction, "asyncCreateLostFound").mockReturnValue(
      () => Promise.resolve(false)
    );

    const { onClose } = renderAddModal({ isOpen: true });

    const form = screen.getByRole("button", { name: "Kirim Laporan" }).closest("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("should call onClose when clicking cancel or close button", () => {
    const { onClose } = renderAddModal({ isOpen: true });

    const cancelBtn = screen.getByRole("button", { name: "Batal" });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const closeHeaderBtn = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeHeaderBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
