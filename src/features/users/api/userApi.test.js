import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getProfileApi,
  getUsersApi,
  updateProfileApi,
  updateAvatarApi,
  updatePasswordApi,
} from "./userApi";
import * as apiHelper from "../../../helpers/apiHelper";

describe("userApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getProfileApi should call fetchWithAuth /users/me and return data", async () => {
    const mockUser = { id: 1, name: "Alice", email: "alice@example.com" };
    vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockUser });

    const result = await getProfileApi();

    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining("/users/me")
    );
    expect(result).toEqual(mockUser);
  });

  it("getUsersApi should call fetchWithAuth /users and return data", async () => {
    const mockUsers = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
    vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockUsers });

    const result = await getUsersApi();

    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining("/users")
    );
    expect(result).toEqual(mockUsers);
  });

  it("updateProfileApi should call fetchWithAuth /users/me with PUT and return data", async () => {
    const payload = { name: "New Name", bio: "New Bio" };
    const mockData = { id: 1, ...payload };
    vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

    const result = await updateProfileApi(payload);

    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining("/users/me"),
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
    expect(result).toEqual(mockData);
  });

  it("updateAvatarApi should call fetchWithAuth /users/me/photo with POST FormData and return data", async () => {
    const formData = new FormData();
    const mockData = { id: 1, photo: "http://photo.url" };
    vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

    const result = await updateAvatarApi(formData);

    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining("/users/me/photo"),
      expect.objectContaining({
        method: "POST",
        body: formData,
      })
    );
    expect(result).toEqual(mockData);
  });

  it("updatePasswordApi should call fetchWithAuth /users/me/password with PUT and return data", async () => {
    const payload = { current_password: "old", new_password: "new" };
    const mockData = { message: "Password updated" };
    vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

    const result = await updatePasswordApi(payload);

    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining("/users/me/password"),
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
    expect(result).toEqual(mockData);
  });
});

