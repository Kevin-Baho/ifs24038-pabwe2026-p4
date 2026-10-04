import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import * as apiHelper from "./helpers/apiHelper";

function renderApp(initialPath = "/", token = "") {
  vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(token);

  const store = configureStore({
    reducer: {
      auth: (state = { isAuthLogin: false, isAuthRegister: false }) => state,
      users: (state = { profile: null, users: [] }) => state,
      lostFounds: (state = { lostFounds: [], detail: null, dailyStats: null, monthlyStats: null }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
}

describe("App Routing", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render LoginPage when navigating to /auth/login without token", () => {
    renderApp("/auth/login", "");
    expect(screen.getByRole("heading", { name: "Masuk Akun" })).toBeInTheDocument();
  });

  it("should render RegisterPage when navigating to /auth/register without token", () => {
    renderApp("/auth/register", "");
    expect(screen.getByRole("heading", { name: "Daftar Akun Baru" })).toBeInTheDocument();
  });

  it("should redirect wildcard unknown routes to /", () => {
    renderApp("/some/random/route", "valid-token");
    expect(screen.getByText("Laporan Lost & Found")).toBeInTheDocument();
  });

  it("should render HomePage on / when user is authenticated", () => {
    renderApp("/", "valid-token");
    expect(screen.getByText("Laporan Lost & Found")).toBeInTheDocument();
  });
});

