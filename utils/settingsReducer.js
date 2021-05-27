export const UPDATE_SETTING = "UPDATE_SETTING";
export const UPDATE_RANGE = "UPDATE_RANGE";
export const RESET = "RESET";

export function initCategoryReducer({ settings, ranges, role }) {
  return { settings, ranges, role };
}

export function categoryReducer(state, action) {
  switch (action.type) {
    case UPDATE_SETTING:
      return {
        ...state,
        settings: state.settings.map((s) => (s._id === action.payload._id ? { ...action.payload } : s)),
      };
    case UPDATE_RANGE:
      return {
        ...state,
        ranges: state.ranges.map((r) => (r._id === action.payload._id ? { ...action.payload } : r)),
      };
    case RESET:
      return initCategoryReducer(action.payload);
    default:
      throw new Error("Unknown category action");
  }
}
