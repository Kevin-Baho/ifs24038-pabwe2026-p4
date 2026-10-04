import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";

describe("SidebarComponent", () => {
  it("should render all navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SidebarComponent />
      </MemoryRouter>
    );

    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("should apply active classes to the current active route", () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <SidebarComponent />
      </MemoryRouter>
    );

    const usersLink = screen.getByRole("link", { name: /Pengguna/i });
    const homeLink = screen.getByRole("link", { name: /Beranda/i });

    expect(usersLink).toHaveClass("bg-blue-50 text-blue-600");
    expect(homeLink).toHaveClass("text-slate-600");
  });
});

