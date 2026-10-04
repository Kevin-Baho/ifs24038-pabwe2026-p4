import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LoginPage from "./LoginPage";
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
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  it("should render login form inputs and buttons properly", () => {
    setupComponent();

    expect(screen.getByRole("heading", { name: "Masuk Akun" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nama@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Masuk" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Daftar sekarang" })).toBeInTheDocument();
  });

  it("should handle input change and submit successfully, navigating to /", async () => {
    vi.spyOn(authAction, "asyncLogin").mockReturnValue(() => Promise.resolve(true));

    setupComponent();

    const emailInput = screen.getByPlaceholderText("nama@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: "Masuk" });

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });

    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("secret123");

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should not navigate when login fails", async () => {
    const loginSpy = vi.spyOn(authAction, "asyncLogin").mockReturnValue(() => Promise.resolve(false));

    setupComponent();

    const form = screen.getByRole("button", { name: "Masuk" }).closest("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
