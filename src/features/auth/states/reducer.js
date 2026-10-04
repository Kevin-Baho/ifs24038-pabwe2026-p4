import { ActionType } from "./action";

const initialState = {
  isAuthLogin: false,
  isAuthRegister: false,
};

export function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_AUTH_LOGIN:
      return { ...state, isAuthLogin: action.payload };
    case ActionType.SET_AUTH_REGISTER:
      return { ...state, isAuthRegister: action.payload };
    case ActionType.SET_AUTH_LOGOUT:
      return { ...state, isAuthLogin: false };
    default:
      return state;
  }
}