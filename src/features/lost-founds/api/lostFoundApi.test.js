import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLostFoundsApi,
  getLostFoundDetailApi,
  createLostFoundApi,
  updateLostFoundApi,
  uploadCoverLostFoundApi,
  deleteLostFoundApi,
  getDailyStatsApi,
  getMonthlyStatsApi,
} from "./lostFoundApi";
import * as apiHelper from "../../../helpers/apiHelper";

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getLostFoundsApi", () => {
    it("should fetch lost founds without query string when params are empty", async () => {
      const mockData = [{ id: 1, title: "Kunci Motor" }];
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await getLostFoundsApi();

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringMatching(/\/lost-founds$/)
      );
      expect(result).toEqual(mockData);
    });

    it("should fetch lost founds with query string when params are provided", async () => {
      const mockData = [{ id: 2, title: "Dompet" }];
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await getLostFoundsApi({ status: "lost", is_completed: "false" });

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds?status=lost&is_completed=false")
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("getLostFoundDetailApi", () => {
    it("should fetch detail of a specific lost found item", async () => {
      const mockData = { id: 10, title: "Laptop Asus" };
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await getLostFoundDetailApi(10);

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds/10")
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("createLostFoundApi", () => {
    it("should POST new lost found item and return data", async () => {
      const payload = { title: "Jam Tangan", description: "Warna hitam", status: "lost" };
      const mockData = { id: 12, ...payload };
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await createLostFoundApi(payload);

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("updateLostFoundApi", () => {
    it("should PUT updated lost found item and return data", async () => {
      const payload = {
        title: "Jam Tangan Casio",
        description: "Warna hitam digital",
        status: "found",
        is_completed: true,
      };
      const mockData = { id: 12, ...payload };
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await updateLostFoundApi(12, payload);

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds/12"),
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("uploadCoverLostFoundApi", () => {
    it("should POST cover photo via FormData and return data", async () => {
      const formData = new FormData();
      const mockData = { id: 12, cover: "http://cover.jpg" };
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await uploadCoverLostFoundApi(12, formData);

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds/12/cover"),
        expect.objectContaining({
          method: "POST",
          body: formData,
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteLostFoundApi", () => {
    it("should send DELETE request and return response data", async () => {
      const mockData = { message: "Deleted" };
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await deleteLostFoundApi(12);

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds/12"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("Stats APIs", () => {
    it("getDailyStatsApi should fetch /lost-founds/stats/daily and return data", async () => {
      const mockData = [{ date: "2026-05-01", count: 5 }];
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await getDailyStatsApi();

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds/stats/daily")
      );
      expect(result).toEqual(mockData);
    });

    it("getMonthlyStatsApi should fetch /lost-founds/stats/monthly and return data", async () => {
      const mockData = [{ month: "2026-05", count: 42 }];
      vi.spyOn(apiHelper, "fetchWithAuth").mockResolvedValueOnce({ data: mockData });

      const result = await getMonthlyStatsApi();

      expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
        expect.stringContaining("/lost-founds/stats/monthly")
      );
      expect(result).toEqual(mockData);
    });
  });
});

