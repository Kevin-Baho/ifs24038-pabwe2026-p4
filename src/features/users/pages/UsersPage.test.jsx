import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UsersPage from "./UsersPage";
import * as usersAction from "../states/action";

function renderUsersPage(usersState, stateOverride = null) {
  const store = configureStore({
    reducer: {
      users: () => (stateOverride !== null ? stateOverride : { users: usersState }),
    },
  });

  return render(
    <Provider store={store}>
      <UsersPage />
    </Provider>
  );
}

describe("UsersPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should dispatch asyncGetUsers on mount and render users list with photos and fallbacks", () => {
    const getUsersSpy = vi
      .spyOn(usersAction, "asyncGetUsers")
      .mockReturnValue(() => Promise.resolve());

    const mockUsers = [
      { id: 1, name: "Alice", email: "alice@example.com", photo: "http://photo/alice.jpg" },
      { id: 2, name: "Bob", email: "bob@example.com", photo: null },
      { id: 3, name: null, email: "noname@example.com", photo: null },
    ];

    renderUsersPage(mockUsers);

    expect(getUsersSpy).toHaveBeenCalled();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByAltText("Alice")).toHaveAttribute("src", "http://photo/alice.jpg");
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("should handle non-array users state gracefully", () => {
    vi.spyOn(usersAction, "asyncGetUsers").mockReturnValue(() => Promise.resolve());

    renderUsersPage(null);

    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("should handle undefined users state object gracefully", () => {
    vi.spyOn(usersAction, "asyncGetUsers").mockReturnValue(() => Promise.resolve());

    renderUsersPage(null, undefined);

    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
  });
});

