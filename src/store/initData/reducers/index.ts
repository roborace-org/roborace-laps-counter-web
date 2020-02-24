import { LOAD_INITDATA_WS } from "../actions";

const initialValue = { wsForm: { wsUrl: "ws://laps.roborace.org:8888/ws" } };

const initDataReducer = (state = initialValue, action) => {
  switch (action.type) {
    case LOAD_INITDATA_WS:
      return {
        ...state,
        wsForm: action.payload
      };
    default:
      return state;
  }
};

export default initDataReducer;
