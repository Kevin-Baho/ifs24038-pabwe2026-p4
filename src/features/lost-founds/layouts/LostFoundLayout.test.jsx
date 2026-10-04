import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LostFoundLayout from "./LostFoundLayout";
import * as apiHelper from "../../../helpers/apiHelper";
import * as usersAction from "../../users/states/action";

function renderLostFoundLayout({ token = "", profile = null } = {}) {
  vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(token);

  const store = configureStore({
    reducer: {
      users: () => ({ profile }),
      auth: (state = {}) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LostFoundLayout />}>
            <Route index element={<div>Dashboard Child</div>} />
          </Route>
          <Route path="/auth/login" element={<div>Login Page Redirected</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("LostFoundLayout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to /auth/login if not authenticated", () => {
    renderLostFoundLayout({ token: "" });

    expect(screen.getByText("Login Page Redirected")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Child")).not.toBeInTheDocument();
  });

  it("should dispatch asyncSetProfile when authenticated and profile is null", () => {
    const setProfileSpy = vi
      .spyOn(usersAction, "asyncSetProfile")
      .mockReturnValue(() => Promise.resolve());

    renderLostFoundLayout({ token: "valid-jwt", profile: null });

    expect(setProfileSpy).toHaveBeenCalled();
    expect(screen.getByText("Dashboard Child")).toBeInTheDocument();
    expect(screen.getByText("Lost & Founds")).toBeInTheDocument();
    expect(screen.getByText("Beranda")).toBeInTheDocument();
  });

  it("should not dispatch asyncSetProfile when profile is already loaded", () => {
    const setProfileSpy = vi.spyOn(usersAction, "asyncSetProfile");

    renderLostFoundLayout({
      token: "valid-jwt",
      profile: { id: 1, name: "Alice" },
    });

    expect(setProfileSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Dashboard Child")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});

