import { describe, it, expect } from "vitest";
import store from "./store";
import { setAuthLogin } from "./features/auth/states/action";

describe("Redux Store", () => {
  it("should initialize with correct reducers", () => {
    const state = store.getState();

    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("lostFounds");

    expect(state.auth).toEqual({
      isAuthLogin: false,
      isAuthRegister: false,
    });
    expect(state.users).toEqual({
      profile: null,
      users: [],
    });
    expect(state.lostFounds).toEqual({
      lostFounds: [],
      detail: null,
      dailyStats: null,
      monthlyStats: null,
    });
  });

  it("should handle dispatch actions properly", () => {
    store.dispatch(setAuthLogin(true));
    expect(store.getState().auth.isAuthLogin).toBe(true);
  });
});

