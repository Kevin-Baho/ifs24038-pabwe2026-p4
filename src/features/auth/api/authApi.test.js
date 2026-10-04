import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginApi, registerApi } from "./authApi";

describe("authApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("loginApi", () => {
    it("should send POST request and return data on success", async () => {
      const mockData = { token: "fake-jwt-token" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      const result = await loginApi({ email: "user@example.com", password: "password123" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@example.com", password: "password123" }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should throw error with API message when response is not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Email atau password salah" }),
      });

      await expect(
        loginApi({ email: "user@example.com", password: "wrong" })
      ).rejects.toThrow("Email atau password salah");
    });

    it("should throw default error message when response is not ok and message is absent", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      });

      await expect(
        loginApi({ email: "user@example.com", password: "wrong" })
      ).rejects.toThrow("Login gagal");
    });
  });

  describe("registerApi", () => {
    it("should send POST request and return data on success", async () => {
      const mockData = { id: 1, name: "User", email: "user@example.com" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      const result = await registerApi({
        name: "User",
        email: "user@example.com",
        password: "password123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "User",
            email: "user@example.com",
            password: "password123",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should throw error with API message when registration fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Email sudah terdaftar" }),
      });

      await expect(
        registerApi({ name: "User", email: "used@example.com", password: "123" })
      ).rejects.toThrow("Email sudah terdaftar");
    });

    it("should throw default error message when response is not ok and message is absent", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      });

      await expect(
        registerApi({ name: "User", email: "used@example.com", password: "123" })
      ).rejects.toThrow("Registrasi gagal");
    });
  });
});

