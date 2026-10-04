import { ActionType } from "./action";

const initialState = {
  profile: null,
  users: [],
};

export function usersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_PROFILE:
      return { ...state, profile: action.payload };
    case ActionType.SET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
}