import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProfilePage from "./ProfilePage";
import * as usersAction from "../states/action";

function renderProfilePage(profileState = null) {
  const store = configureStore({
    reducer: {
      users: () => ({ profile: profileState }),
    },
  });

  return render(
    <Provider store={store}>
      <ProfilePage />
    </Provider>
  );
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render empty initial state when profile is null", () => {
    renderProfilePage(null);

    expect(screen.getByRole("heading", { name: "Pengaturan Akun" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveValue("");
    expect(screen.getByLabelText("Bio")).toHaveValue("");
  });

  it("should populate profile fields when profile exists with photo and bio", () => {
    const mockProfile = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      bio: "Web Developer",
      photo: "http://photo.com/me.jpg",
    };

    renderProfilePage(mockProfile);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Bio")).toHaveValue("Web Developer");
    expect(screen.getByAltText("John Doe")).toHaveAttribute("src", "http://photo.com/me.jpg");
  });

  it("should show initial character when profile has no photo", () => {
    const mockProfile = {
      id: 2,
      name: "Alice",
      email: "alice@example.com",
      bio: "",
      photo: null,
    };

    renderProfilePage(mockProfile);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("should handle profile with null name and bio", () => {
    const mockProfile = {
      id: 3,
      name: null,
      email: "null@example.com",
      bio: null,
      photo: null,
    };

    renderProfilePage(mockProfile);

    expect(screen.getByLabelText("Nama")).toHaveValue("");
    expect(screen.getByLabelText("Bio")).toHaveValue("");
  });

  it("should handle profile submit", () => {
    const updateProfileSpy = vi
      .spyOn(usersAction, "asyncUpdateProfile")
      .mockReturnValue(() => Promise.resolve(true));

    const mockProfile = {
      id: 1,
      name: "Initial Name",
      email: "init@example.com",
      bio: "Initial Bio",
    };

    renderProfilePage(mockProfile);

    const nameInput = screen.getByLabelText("Nama");
    const bioInput = screen.getByLabelText("Bio");
    const submitBtn = screen.getByRole("button", { name: "Simpan Profil" });

    fireEvent.change(nameInput, { target: { value: "Updated Name" } });
    fireEvent.change(bioInput, { target: { value: "Updated Bio" } });
    fireEvent.click(submitBtn);

    expect(updateProfileSpy).toHaveBeenCalledWith({
      name: "Updated Name",
      bio: "Updated Bio",
    });
  });

  it("should handle password submit and reset input values", () => {
    const updatePasswordSpy = vi
      .spyOn(usersAction, "asyncUpdatePassword")
      .mockReturnValue(() => Promise.resolve(true));

    renderProfilePage({ id: 1, name: "User" });

    const currentPwdInput = screen.getByLabelText("Kata Sandi Saat Ini");
    const newPwdInput = screen.getByLabelText("Kata Sandi Baru");
    const submitBtn = screen.getByRole("button", { name: "Perbarui Kata Sandi" });

    fireEvent.change(currentPwdInput, { target: { value: "oldPassword" } });
    fireEvent.change(newPwdInput, { target: { value: "newPassword123" } });

    expect(currentPwdInput.value).toBe("oldPassword");
    expect(newPwdInput.value).toBe("newPassword123");

    fireEvent.click(submitBtn);

    expect(updatePasswordSpy).toHaveBeenCalledWith({
      current_password: "oldPassword",
      new_password: "newPassword123",
    });
    expect(currentPwdInput.value).toBe("");
    expect(newPwdInput.value).toBe("");
  });

  it("should handle avatar file change when file is selected", () => {
    const updateAvatarSpy = vi
      .spyOn(usersAction, "asyncUpdateAvatar")
      .mockReturnValue(() => Promise.resolve(true));

    renderProfilePage({ id: 1, name: "User" });

    const fileInput = document.querySelector('input[type="file"]');
    const fakeFile = new File(["test image"], "profile.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    expect(updateAvatarSpy).toHaveBeenCalledWith(fakeFile);
  });

  it("should not dispatch avatar update if no file is selected", () => {
    const updateAvatarSpy = vi
      .spyOn(usersAction, "asyncUpdateAvatar")
      .mockReturnValue(() => Promise.resolve(true));

    renderProfilePage({ id: 1, name: "User" });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(updateAvatarSpy).not.toHaveBeenCalled();
  });
});
