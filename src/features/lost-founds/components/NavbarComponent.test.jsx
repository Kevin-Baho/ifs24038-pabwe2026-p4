import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import NavbarComponent from "./NavbarComponent";
import * as authAction from "../../auth/states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderNavbar(profileState = null) {
  const store = configureStore({
    reducer: {
      users: () => ({ profile: profileState }),
      auth: (state = {}) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <NavbarComponent />
      </MemoryRouter>
    </Provider>
  );
}

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  it("should render fallback text when profile is null", () => {
    renderNavbar(null);

    expect(screen.getByText("Lost & Founds")).toBeInTheDocument();
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("should render user initial when profile has name but no photo", () => {
    const profile = { name: "Budi", email: "budi@test.com" };
    renderNavbar(profile);

    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("budi@test.com")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("should render user photo when profile has photo", () => {
    const profile = { name: "Budi", photo: "http://img.com/avatar.jpg" };
    renderNavbar(profile);

    const img = screen.getByAltText("Budi");
    expect(img).toHaveAttribute("src", "http://img.com/avatar.jpg");
  });

  it("should render fallback alt text when profile has photo but no name", () => {
    const profile = { name: "", photo: "http://img.com/avatar.jpg" };
    renderNavbar(profile);

    const img = screen.getByAltText("User");
    expect(img).toHaveAttribute("src", "http://img.com/avatar.jpg");
  });

  it("should handle logout click and navigate to /auth/login", () => {
    const logoutSpy = vi
      .spyOn(authAction, "asyncLogout")
      .mockReturnValue(() => {});

    renderNavbar({ name: "User" });

    const logoutBtn = screen.getByRole("button", { name: "Keluar" });
    fireEvent.click(logoutBtn);

    expect(logoutSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
  });
});
