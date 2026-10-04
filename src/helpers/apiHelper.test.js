import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ACCESS_TOKEN_KEY,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  fetchWithAuth,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Token Management", () => {
    it("should return empty string when token is not in localStorage", () => {
      expect(getAccessToken()).toBe("");
    });

    it("should return token when it exists in localStorage", () => {
      localStorage.setItem(ACCESS_TOKEN_KEY, "my-secret-token");
      expect(getAccessToken()).toBe("my-secret-token");
    });

    it("should put token into localStorage", () => {
      putAccessToken("new-token-123");
      expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("new-token-123");
    });

    it("should remove token from localStorage", () => {
      putAccessToken("token-to-remove");
      removeAccessToken();
      expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    });
  });

  describe("fetchWithAuth", () => {
    it("should call fetch with Authorization header when token is present", async () => {
      putAccessToken("auth-token-xyz");

      const mockResponse = { data: "success" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchWithAuth("https://api.example.com/test", {
        headers: { "Custom-Header": "custom-value" },
      });

      expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
        headers: {
          "Custom-Header": "custom-value",
          Authorization: "Bearer auth-token-xyz",
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should call fetch without Authorization header and default options when token is absent", async () => {
      const mockResponse = { status: "ok" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchWithAuth("https://api.example.com/public");

      expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/public", {
        headers: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error with API message when response is not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Item tidak ditemukan" }),
      });

      await expect(fetchWithAuth("https://api.example.com/fail")).rejects.toThrow(
        "Item tidak ditemukan"
      );
    });

    it("should throw default error message when response is not ok and message is undefined", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      });

      await expect(fetchWithAuth("https://api.example.com/fail-no-msg")).rejects.toThrow(
        "Terjadi kesalahan saat memproses permintaan."
      );
    });
  });
});

