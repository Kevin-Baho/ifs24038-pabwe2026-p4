import { describe, it, expect } from "vitest";
import { lostFoundsReducer } from "./reducer";
import { ActionType } from "./action";

describe("lostFoundsReducer", () => {
  it("should return the initial state when called with undefined state and empty action", () => {
    const state = lostFoundsReducer();
    expect(state).toEqual({
      lostFounds: [],
      detail: null,
      dailyStats: null,
      monthlyStats: null,
    });
  });

  it("should return current state for unknown action", () => {
    const currentState = {
      lostFounds: [{ id: 1 }],
      detail: null,
      dailyStats: null,
      monthlyStats: null,
    };
    const nextState = lostFoundsReducer(currentState, { type: "UNKNOWN" });
    expect(nextState).toEqual(currentState);
  });

  it("should handle SET_LOST_FOUNDS", () => {
    const payload = [{ id: 10, title: "Payung" }];
    const nextState = lostFoundsReducer(undefined, {
      type: ActionType.SET_LOST_FOUNDS,
      payload,
    });
    expect(nextState.lostFounds).toEqual(payload);
  });

  it("should handle SET_LOST_FOUND_DETAIL", () => {
    const payload = { id: 10, title: "Payung Merah" };
    const nextState = lostFoundsReducer(undefined, {
      type: ActionType.SET_LOST_FOUND_DETAIL,
      payload,
    });
    expect(nextState.detail).toEqual(payload);
  });

  it("should handle SET_DAILY_STATS", () => {
    const payload = [{ date: "2026-05-01", count: 4 }];
    const nextState = lostFoundsReducer(undefined, {
      type: ActionType.SET_DAILY_STATS,
      payload,
    });
    expect(nextState.dailyStats).toEqual(payload);
  });

  it("should handle SET_MONTHLY_STATS", () => {
    const payload = [{ month: "2026-05", count: 12 }];
    const nextState = lostFoundsReducer(undefined, {
      type: ActionType.SET_MONTHLY_STATS,
      payload,
    });
    expect(nextState.monthlyStats).toEqual(payload);
  });
});

