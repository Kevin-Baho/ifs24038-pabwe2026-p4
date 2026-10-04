import { ActionType } from "./action";

const initialState = {
  lostFounds: [],
  detail: null,
  dailyStats: null,
  monthlyStats: null,
};

export function lostFoundsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUNDS:
      return { ...state, lostFounds: action.payload };
    case ActionType.SET_LOST_FOUND_DETAIL:
      return { ...state, detail: action.payload };
    case ActionType.SET_DAILY_STATS:
      return { ...state, dailyStats: action.payload };
    case ActionType.SET_MONTHLY_STATS:
      return { ...state, monthlyStats: action.payload };
    default:
      return state;
  }
}

