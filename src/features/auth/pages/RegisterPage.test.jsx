import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RegisterPage from "./RegisterPage";
import * as authAction from "../states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function setupComponent() {
  const store = configureStore({
    reducer: {
      auth: (state = {}) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </Provider>
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  it("should render registration form elements properly", () => {
    setupComponent();

    expect(screen.getByRole("heading", { name: "Daftar Akun Baru" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nama Lengkap")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nama@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Daftar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Masuk di sini" })).toBeInTheDocument();
  });

  it("should handle form inputs and navigate to /auth/login on successful register", async () => {
    vi.spyOn(authAction, "asyncRegister").mockReturnValue(() => Promise.resolve(true));

    setupComponent();

    const nameInput = screen.getByPlaceholderText("Nama Lengkap");
    const emailInput = screen.getByPlaceholderText("nama@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: "Daftar" });

    fireEvent.change(nameInput, { target: { value: "Budi Santoso" } });
    fireEvent.change(emailInput, { target: { value: "budi@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "rahasia123" } });

    expect(nameInput.value).toBe("Budi Santoso");
    expect(emailInput.value).toBe("budi@example.com");
    expect(passwordInput.value).toBe("rahasia123");

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should not navigate when registration fails", async () => {
    const registerSpy = vi.spyOn(authAction, "asyncRegister").mockReturnValue(() => Promise.resolve(false));

    setupComponent();

    const form = screen.getByRole("button", { name: "Daftar" }).closest("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
