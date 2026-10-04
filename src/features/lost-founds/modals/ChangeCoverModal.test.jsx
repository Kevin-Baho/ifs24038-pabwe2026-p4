import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ChangeCoverModal from "./ChangeCoverModal";
import * as lostFoundAction from "../states/action";

function renderChangeCoverModal({ itemId = 1, isOpen = true, onClose = vi.fn() }) {
  const store = configureStore({
    reducer: {
      lostFounds: (state = {}) => state,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <ChangeCoverModal itemId={itemId} isOpen={isOpen} onClose={onClose} />
      </Provider>
    ),
    onClose,
  };
}

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null when isOpen is false", () => {
    renderChangeCoverModal({ isOpen: false });
    expect(screen.queryByText("Ubah Cover Gambar")).not.toBeInTheDocument();
  });

  it("should render modal when isOpen is true", () => {
    renderChangeCoverModal({ isOpen: true });
    expect(screen.getByText("Ubah Cover Gambar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unggah Cover" })).toBeDisabled();
  });

  it("should handle file selection and preview generation", () => {
    renderChangeCoverModal({ isOpen: true });

    const fileInput = document.querySelector('input[type="file"]');
    const fakeFile = new File(["dummy image"], "cover.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    expect(screen.getByAltText("Pratinjau Sampul")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unggah Cover" })).not.toBeDisabled();
  });

  it("should ignore file change when target files is empty", () => {
    renderChangeCoverModal({ isOpen: true });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(screen.queryByAltText("Pratinjau Sampul")).not.toBeInTheDocument();
  });

  it("should upload file successfully and close modal", async () => {
    const uploadSpy = vi
      .spyOn(lostFoundAction, "asyncUploadCoverLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const { onClose } = renderChangeCoverModal({ itemId: 42, isOpen: true });

    const fileInput = document.querySelector('input[type="file"]');
    const fakeFile = new File(["image-bytes"], "cover.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    const submitBtn = screen.getByRole("button", { name: "Unggah Cover" });
    fireEvent.submit(submitBtn.closest("form"));

    expect(uploadSpy).toHaveBeenCalledWith(42, fakeFile);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not close modal when upload fails", async () => {
    vi.spyOn(lostFoundAction, "asyncUploadCoverLostFound").mockReturnValue(
      () => Promise.resolve(false)
    );

    const { onClose } = renderChangeCoverModal({ itemId: 42, isOpen: true });

    const fileInput = document.querySelector('input[type="file"]');
    const fakeFile = new File(["image-bytes"], "cover.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    const submitBtn = screen.getByRole("button", { name: "Unggah Cover" });
    fireEvent.submit(submitBtn.closest("form"));

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("should do nothing if form submit is called without file", () => {
    const uploadSpy = vi.spyOn(lostFoundAction, "asyncUploadCoverLostFound");
    const { onClose } = renderChangeCoverModal({ itemId: 42, isOpen: true });

    const form = document.querySelector("form");
    fireEvent.submit(form);

    expect(uploadSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should reset file and call onClose on cancel or header close", () => {
    const { onClose } = renderChangeCoverModal({ isOpen: true });

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "✕" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
