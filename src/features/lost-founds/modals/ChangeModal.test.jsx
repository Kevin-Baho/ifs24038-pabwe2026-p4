import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ChangeModal from "./ChangeModal";
import * as lostFoundAction from "../states/action";

function renderChangeModal({ item = null, isOpen = true, onClose = vi.fn() }) {
  const store = configureStore({
    reducer: {
      lostFounds: (state = {}) => state,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <ChangeModal item={item} isOpen={isOpen} onClose={onClose} />
      </Provider>
    ),
    onClose,
  };
}

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null if isOpen is false", () => {
    const item = { id: 1, title: "Item" };
    renderChangeModal({ item, isOpen: false });
    expect(screen.queryByText("Edit Laporan")).not.toBeInTheDocument();
  });

  it("should return null if item is null", () => {
    renderChangeModal({ item: null, isOpen: true });
    expect(screen.queryByText("Edit Laporan")).not.toBeInTheDocument();
  });

  it("should populate inputs with item values", () => {
    const item = {
      id: 5,
      title: "Laptop Acer",
      description: "Charger tertinggal",
      status: "lost",
      is_completed: false,
    };

    renderChangeModal({ item, isOpen: true });

    expect(screen.getByDisplayValue("Laptop Acer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Charger tertinggal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Kehilangan (Lost)")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should populate fallback values when item fields are empty", () => {
    const item = {
      id: 6,
      title: "",
      description: "",
      status: "",
      is_completed: 1,
    };

    renderChangeModal({ item, isOpen: true });

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should handle updates and submit form successfully", async () => {
    const updateSpy = vi
      .spyOn(lostFoundAction, "asyncUpdateLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const item = {
      id: 5,
      title: "Old Title",
      description: "Old Desc",
      status: "lost",
      is_completed: false,
    };

    const { onClose } = renderChangeModal({ item, isOpen: true });

    const titleInput = screen.getByDisplayValue("Old Title");
    const descInput = screen.getByDisplayValue("Old Desc");
    const statusSelect = screen.getByRole("combobox");
    const checkbox = screen.getByRole("checkbox");
    const submitBtn = screen.getByRole("button", { name: "Simpan Perubahan" });

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    fireEvent.change(descInput, { target: { value: "New Desc" } });
    fireEvent.change(statusSelect, { target: { value: "found" } });
    fireEvent.click(checkbox);
    fireEvent.click(submitBtn);

    expect(updateSpy).toHaveBeenCalledWith(5, {
      title: "New Title",
      description: "New Desc",
      status: "found",
      is_completed: true,
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not close when update fails", async () => {
    const updateSpy = vi.spyOn(lostFoundAction, "asyncUpdateLostFound").mockReturnValue(
      () => Promise.resolve(false)
    );

    const item = { id: 5, title: "Title" };
    const { onClose } = renderChangeModal({ item, isOpen: true });

    const form = screen.getByRole("button", { name: "Simpan Perubahan" }).closest("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("should call onClose when clicking cancel or header close", () => {
    const item = { id: 5, title: "Title" };
    const { onClose } = renderChangeModal({ item, isOpen: true });

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "✕" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
