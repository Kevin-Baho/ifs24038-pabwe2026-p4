import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import * as apiHelper from "../../../helpers/apiHelper";

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to / if user already has access token", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="" element={<div>Child Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Child Page")).not.toBeInTheDocument();
  });

  it("should render outlet and branding when user is not authenticated", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("");

    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<div>Login Page Outlet</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Delcom Lost & Founds")).toBeInTheDocument();
    expect(screen.getByText("Login Page Outlet")).toBeInTheDocument();
  });
});

