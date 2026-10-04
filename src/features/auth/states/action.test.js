import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setAuthLogin,
  setAuthLogout,
  setAuthRegister,
  asyncLogin,
  asyncRegister,
  asyncLogout,
} from "./action";
import * as authApi from "../api/authApi";
import * as apiHelper from "../../../helpers/apiHelper";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as userActions from "../../users/states/action";

describe("auth action creators & thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("action creators", () => {
    it("setAuthLogin creates correct action", () => {
      expect(setAuthLogin(true)).toEqual({
        type: ActionType.SET_AUTH_LOGIN,
        payload: true,
      });
    });

    it("setAuthLogout creates correct action", () => {
      expect(setAuthLogout()).toEqual({
        type: ActionType.SET_AUTH_LOGOUT,
      });
    });

    it("setAuthRegister creates correct action", () => {
      expect(setAuthRegister(true)).toEqual({
        type: ActionType.SET_AUTH_REGISTER,
        payload: true,
      });
    });
  });

  describe("asyncLogin", () => {
    it("should dispatch actions and show success dialog on successful login", async () => {
      const dispatch = vi.fn().mockImplementation((action) => {
        if (typeof action === "function") {
          return action(vi.fn());
        }
        return action;
      });
      const putAccessTokenSpy = vi.spyOn(apiHelper, "putAccessToken").mockImplementation(() => {});
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(authApi, "loginApi").mockResolvedValueOnce({ token: "test-token" });
      vi.spyOn(userActions, "asyncSetProfile").mockReturnValue(() => Promise.resolve());

      const result = await asyncLogin({ email: "test@example.com", password: "password" })(dispatch);

      expect(putAccessTokenSpy).toHaveBeenCalledWith("test-token");
      expect(dispatch).toHaveBeenCalledWith(setAuthLogin(true));
      expect(showSuccessSpy).toHaveBeenCalledWith("Login berhasil! Selamat datang.");
      expect(result).toBe(true);
    });

    it("should handle error and show error dialog on login failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(authApi, "loginApi").mockRejectedValueOnce(new Error("Login failed"));

      const result = await asyncLogin({ email: "test@example.com", password: "wrong" })(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Login failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncRegister", () => {
    it("should dispatch setAuthRegister and show success dialog on successful register", async () => {
      const dispatch = vi.fn();
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(authApi, "registerApi").mockResolvedValueOnce({ id: 1 });

      const result = await asyncRegister({
        name: "Test User",
        email: "test@example.com",
        password: "password",
      })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setAuthRegister(true));
      expect(showSuccessSpy).toHaveBeenCalledWith("Registrasi akun berhasil! Silakan login.");
      expect(result).toBe(true);
    });

    it("should handle error and show error dialog on register failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(authApi, "registerApi").mockRejectedValueOnce(new Error("Registration failed"));

      const result = await asyncRegister({
        name: "Test User",
        email: "test@example.com",
        password: "password",
      })(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Registration failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncLogout", () => {
    it("should remove token, dispatch logout & reset profile, and show success dialog", () => {
      const dispatch = vi.fn();
      const removeTokenSpy = vi.spyOn(apiHelper, "removeAccessToken").mockImplementation(() => {});
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      asyncLogout()(dispatch);

      expect(removeTokenSpy).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setAuthLogout());
      expect(dispatch).toHaveBeenCalledWith(userActions.setProfile(null));
      expect(showSuccessSpy).toHaveBeenCalledWith("Berhasil keluar.");
    });
  });
});

