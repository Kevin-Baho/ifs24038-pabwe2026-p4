import { describe, it, expect } from "vitest";
import { authReducer } from "./reducer";
import { ActionType } from "./action";

describe("authReducer", () => {
  it("should return the initial state when called with undefined state and empty action", () => {
    const state = authReducer();
    expect(state).toEqual({
      isAuthLogin: false,
      isAuthRegister: false,
    });
  });

  it("should return the current state for unknown action type", () => {
    const currentState = { isAuthLogin: true, isAuthRegister: false };
    const nextState = authReducer(currentState, { type: "UNKNOWN_ACTION" });
    expect(nextState).toEqual(currentState);
  });

  it("should handle SET_AUTH_LOGIN", () => {
    const nextState = authReducer(undefined, {
      type: ActionType.SET_AUTH_LOGIN,
      payload: true,
    });
    expect(nextState.isAuthLogin).toBe(true);
  });

  it("should handle SET_AUTH_REGISTER", () => {
    const nextState = authReducer(undefined, {
      type: ActionType.SET_AUTH_REGISTER,
      payload: true,
    });
    expect(nextState.isAuthRegister).toBe(true);
  });

  it("should handle SET_AUTH_LOGOUT", () => {
    const loggedInState = { isAuthLogin: true, isAuthRegister: true };
    const nextState = authReducer(loggedInState, {
      type: ActionType.SET_AUTH_LOGOUT,
    });
    expect(nextState.isAuthLogin).toBe(false);
  });
});

