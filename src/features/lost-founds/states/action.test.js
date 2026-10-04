import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setLostFounds,
  setLostFoundDetail,
  setDailyStats,
  setMonthlyStats,
  asyncGetLostFounds,
  asyncGetLostFoundDetail,
  asyncGetDailyStats,
  asyncGetMonthlyStats,
  asyncCreateLostFound,
  asyncUpdateLostFound,
  asyncUploadCoverLostFound,
  asyncDeleteLostFound,
} from "./action";
import * as lostFoundApi from "../api/lostFoundApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("lost-founds actions and thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("action creators", () => {
    it("setLostFounds", () => {
      const payload = [{ id: 1 }];
      expect(setLostFounds(payload)).toEqual({
        type: ActionType.SET_LOST_FOUNDS,
        payload,
      });
    });

    it("setLostFoundDetail", () => {
      const payload = { id: 1, title: "Item" };
      expect(setLostFoundDetail(payload)).toEqual({
        type: ActionType.SET_LOST_FOUND_DETAIL,
        payload,
      });
    });

    it("setDailyStats", () => {
      const payload = [{ day: 1 }];
      expect(setDailyStats(payload)).toEqual({
        type: ActionType.SET_DAILY_STATS,
        payload,
      });
    });

    it("setMonthlyStats", () => {
      const payload = [{ month: "Jan" }];
      expect(setMonthlyStats(payload)).toEqual({
        type: ActionType.SET_MONTHLY_STATS,
        payload,
      });
    });
  });

  describe("asyncGetLostFounds", () => {
    it("should fetch and dispatch setLostFounds with default filters", async () => {
      const dispatch = vi.fn();
      const mockData = [{ id: 1 }];
      vi.spyOn(lostFoundApi, "getLostFoundsApi").mockResolvedValueOnce(mockData);

      await asyncGetLostFounds()(dispatch);

      expect(lostFoundApi.getLostFoundsApi).toHaveBeenCalledWith({});
      expect(dispatch).toHaveBeenCalledWith(setLostFounds(mockData));
    });

    it("should fetch with custom filters", async () => {
      const dispatch = vi.fn();
      const mockData = [{ id: 2 }];
      vi.spyOn(lostFoundApi, "getLostFoundsApi").mockResolvedValueOnce(mockData);

      await asyncGetLostFounds({ status: "lost" })(dispatch);

      expect(lostFoundApi.getLostFoundsApi).toHaveBeenCalledWith({ status: "lost" });
      expect(dispatch).toHaveBeenCalledWith(setLostFounds(mockData));
    });

    it("should handle error and show error dialog", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "getLostFoundsApi").mockRejectedValueOnce(new Error("Fetch failed"));

      await asyncGetLostFounds()(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Fetch failed");
    });
  });

  describe("asyncGetLostFoundDetail", () => {
    it("should fetch and dispatch detail on success", async () => {
      const dispatch = vi.fn();
      const mockDetail = { id: 5, title: "Phone" };
      vi.spyOn(lostFoundApi, "getLostFoundDetailApi").mockResolvedValueOnce(mockDetail);

      await asyncGetLostFoundDetail(5)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundDetail(mockDetail));
    });

    it("should show error dialog on error", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "getLostFoundDetailApi").mockRejectedValueOnce(new Error("Detail failed"));

      await asyncGetLostFoundDetail(5)(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Detail failed");
    });
  });

  describe("asyncGetDailyStats", () => {
    it("should dispatch setDailyStats on success", async () => {
      const dispatch = vi.fn();
      const mockStats = [{ date: "2026-01-01", count: 2 }];
      vi.spyOn(lostFoundApi, "getDailyStatsApi").mockResolvedValueOnce(mockStats);

      await asyncGetDailyStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setDailyStats(mockStats));
    });

    it("should show error dialog on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "getDailyStatsApi").mockRejectedValueOnce(new Error("Stats error"));

      await asyncGetDailyStats()(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Stats error");
    });
  });

  describe("asyncGetMonthlyStats", () => {
    it("should dispatch setMonthlyStats on success", async () => {
      const dispatch = vi.fn();
      const mockStats = [{ month: "2026-01", count: 10 }];
      vi.spyOn(lostFoundApi, "getMonthlyStatsApi").mockResolvedValueOnce(mockStats);

      await asyncGetMonthlyStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setMonthlyStats(mockStats));
    });

    it("should show error dialog on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "getMonthlyStatsApi").mockRejectedValueOnce(new Error("Monthly error"));

      await asyncGetMonthlyStats()(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Monthly error");
    });
  });

  describe("asyncCreateLostFound", () => {
    it("should create item, show dialog, refresh items, and return true", async () => {
      const dispatch = vi.fn().mockImplementation((fn) => {
        if (typeof fn === "function") return fn(vi.fn());
        return fn;
      });
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "createLostFoundApi").mockResolvedValueOnce({ id: 1 });
      vi.spyOn(lostFoundApi, "getLostFoundsApi").mockResolvedValueOnce([]);

      const result = await asyncCreateLostFound({
        title: "Test",
        description: "Desc",
        status: "lost",
      })(dispatch);

      expect(showSuccessSpy).toHaveBeenCalledWith("Laporan berhasil dibuat!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "createLostFoundApi").mockRejectedValueOnce(new Error("Create failed"));

      const result = await asyncCreateLostFound({
        title: "Test",
        description: "Desc",
        status: "lost",
      })(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Create failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncUpdateLostFound", () => {
    it("should update item, refresh detail and items, show dialog, and return true", async () => {
      const dispatch = vi.fn().mockImplementation((fn) => {
        if (typeof fn === "function") return fn(vi.fn());
        return fn;
      });
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "updateLostFoundApi").mockResolvedValueOnce({ id: 1 });
      vi.spyOn(lostFoundApi, "getLostFoundDetailApi").mockResolvedValueOnce({ id: 1 });
      vi.spyOn(lostFoundApi, "getLostFoundsApi").mockResolvedValueOnce([]);

      const result = await asyncUpdateLostFound(1, { title: "Updated" })(dispatch);

      expect(showSuccessSpy).toHaveBeenCalledWith("Laporan berhasil diperbarui!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "updateLostFoundApi").mockRejectedValueOnce(new Error("Update failed"));

      const result = await asyncUpdateLostFound(1, { title: "Updated" })(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Update failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncUploadCoverLostFound", () => {
    it("should upload cover, refresh detail, show dialog, and return true", async () => {
      const dispatch = vi.fn().mockImplementation((fn) => {
        if (typeof fn === "function") return fn(vi.fn());
        return fn;
      });
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "uploadCoverLostFoundApi").mockResolvedValueOnce({ id: 1 });
      vi.spyOn(lostFoundApi, "getLostFoundDetailApi").mockResolvedValueOnce({ id: 1 });

      const fakeFile = new File(["cover-bytes"], "cover.jpg", { type: "image/jpeg" });
      const result = await asyncUploadCoverLostFound(1, fakeFile)(dispatch);

      expect(showSuccessSpy).toHaveBeenCalledWith("Cover berhasil diunggah!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "uploadCoverLostFoundApi").mockRejectedValueOnce(new Error("Upload cover failed"));

      const fakeFile = new File(["cover-bytes"], "cover.jpg", { type: "image/jpeg" });
      const result = await asyncUploadCoverLostFound(1, fakeFile)(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Upload cover failed");
      expect(result).toBe(false);
    });
  });

  describe("asyncDeleteLostFound", () => {
    it("should delete item, refresh list, show dialog, and return true", async () => {
      const dispatch = vi.fn().mockImplementation((fn) => {
        if (typeof fn === "function") return fn(vi.fn());
        return fn;
      });
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "deleteLostFoundApi").mockResolvedValueOnce({});
      vi.spyOn(lostFoundApi, "getLostFoundsApi").mockResolvedValueOnce([]);

      const result = await asyncDeleteLostFound(1)(dispatch);

      expect(showSuccessSpy).toHaveBeenCalledWith("Laporan berhasil dihapus!");
      expect(result).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "deleteLostFoundApi").mockRejectedValueOnce(new Error("Delete failed"));

      const result = await asyncDeleteLostFound(1)(dispatch);

      expect(showErrorSpy).toHaveBeenCalledWith("Delete failed");
      expect(result).toBe(false);
    });
  });
});

