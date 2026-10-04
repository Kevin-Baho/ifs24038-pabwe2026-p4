import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setProfile,
  setUsers,
  asyncSetProfile,
  asyncGetUsers,
  asyncUpdateProfile,
  asyncUpdateAvatar,
  asyncUpdatePassword,
  asyncChangeProfilePassword,
} from "./action";
import * as userApi from "../api/userApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("users action creators & thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("action creators", () => {
    it("setProfile creates correct action", () => {
      const payload = { id: 1, name: "Alice" };
      expect(setProfile(payload)).toEqual({
        type: ActionType.SET_PROFILE,
        payload,
      });
    });

    it("setUsers creates correct action", () => {
      const payload = [{ id: 1 }];
      expect(setUsers(payload)).toEqual({
        type: ActionType.SET_USERS,
        payload,
      });
    });
  });

  describe("asyncSetProfile", () => {
    it("should dispatch setProfile with user data on success", async () => {
      const dispatch = vi.fn();
      const mockUser = { id: 1, name: "Alice" };
      vi.spyOn(userApi, "getProfileApi").mockResolvedValueOnce(mockUser);

      const result = await asyncSetProfile()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setProfile(mockUser));
      expect(result).toEqual(mockUser);
    });

    it("should dispatch setProfile(null) on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getProfileApi").mockRejectedValueOnce(new Error("Failed"));

      const result = await asyncSetProfile()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setProfile(null));
      expect(result).toBeNull();
    });
  });

  describe("asyncGetUsers", () => {
    it("should dispatch setUsers on success", async () => {
      const dispatch = vi.fn();
      const mockUsers = [{ id: 1 }, { id: 2 }];
      vi.spyOn(userApi, "getUsersApi").mockResolvedValueOnce(mockUsers);

      await asyncGetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setUsers(mockUsers));
    });

    it("should show error dialog on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "getUsersApi").mockRejectedValueOnce(new Error("Network error"));

      await asyncGetUsers()(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Network error");
    });
  });

  describe("asyncUpdateProfile", () => {
    it("should update profile, refresh profile, show success dialog, and return true", async () => {
      const dispatch = vi.fn().mockImplementation((fn) => {
        if (typeof fn === "function") return fn(vi.fn());
        return fn;
      });
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "updateProfileApi").mockResolvedValueOnce({ id: 1 });
      vi.spyOn(userApi, "getProfileApi").mockResolvedValueOnce({ id: 1, name: "New" });

      const result = await asyncUpdateProfile({ name: "New", bio: "Bio" })(dispatch);

      expect(showSuccessSpy).toHaveBeenCalledWith("Profil berhasil diperbarui!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "updateProfileApi").mockRejectedValueOnce(new Error("Update failed"));

      const result = await asyncUpdateProfile({ name: "New", bio: "Bio" })(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Update failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncUpdateAvatar", () => {
    it("should upload avatar file, refresh profile, show success dialog, and return true", async () => {
      const dispatch = vi.fn().mockImplementation((fn) => {
        if (typeof fn === "function") return fn(vi.fn());
        return fn;
      });
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "updateAvatarApi").mockResolvedValueOnce({ id: 1, photo: "url" });
      vi.spyOn(userApi, "getProfileApi").mockResolvedValueOnce({ id: 1 });

      const fakeFile = new File(["dummy content"], "avatar.png", { type: "image/png" });
      const result = await asyncUpdateAvatar(fakeFile)(dispatch);

      expect(showSuccessSpy).toHaveBeenCalledWith("Foto profil berhasil diperbarui!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "updateAvatarApi").mockRejectedValueOnce(new Error("Upload failed"));

      const fakeFile = new File(["dummy content"], "avatar.png", { type: "image/png" });
      const result = await asyncUpdateAvatar(fakeFile)(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Upload failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncUpdatePassword", () => {
    it("should update password, show success dialog, and return true", async () => {
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "updatePasswordApi").mockResolvedValueOnce({});

      const result = await asyncUpdatePassword({
        current_password: "old",
        new_password: "new",
      })();

      expect(showSuccessSpy).toHaveBeenCalledWith("Kata sandi berhasil diperbarui!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(userApi, "updatePasswordApi").mockRejectedValueOnce(new Error("Wrong password"));

      const result = await asyncUpdatePassword({
        current_password: "wrong",
        new_password: "new",
      })();

      expect(showErrorSpy).toHaveBeenCalledWith("Wrong password");
      expect(result).toBe(false);
    });

    it("should support password alias property via asyncChangeProfilePassword", async () => {
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      const updatePasswordSpy = vi.spyOn(userApi, "updatePasswordApi").mockResolvedValueOnce({});

      const result = await asyncChangeProfilePassword({
        current_password: "old",
        password: "newFromAlias",
      })();

      expect(updatePasswordSpy).toHaveBeenCalledWith({
        current_password: "old",
        new_password: "newFromAlias",
      });
      expect(showSuccessSpy).toHaveBeenCalledWith("Kata sandi berhasil diperbarui!");
      expect(result).toBe(true);
    });
  });
});

