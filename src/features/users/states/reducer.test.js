import { describe, it, expect } from "vitest";
import { usersReducer } from "./reducer";
import { ActionType } from "./action";

describe("usersReducer", () => {
  it("should return the initial state when called with undefined state and empty action", () => {
    const state = usersReducer();
    expect(state).toEqual({
      profile: null,
      users: [],
    });
  });

  it("should return unchanged state for unknown action", () => {
    const currentState = { profile: { id: 1 }, users: [] };
    const nextState = usersReducer(currentState, { type: "UNKNOWN" });
    expect(nextState).toEqual(currentState);
  });

  it("should handle SET_PROFILE", () => {
    const payload = { id: 1, name: "Alice", email: "alice@delcom.org" };
    const nextState = usersReducer(undefined, {
      type: ActionType.SET_PROFILE,
      payload,
    });
    expect(nextState.profile).toEqual(payload);
  });

  it("should handle SET_USERS", () => {
    const payload = [{ id: 1 }, { id: 2 }];
    const nextState = usersReducer(undefined, {
      type: ActionType.SET_USERS,
      payload,
    });
    expect(nextState.users).toEqual(payload);
  });
});

