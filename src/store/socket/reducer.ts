import { Reducer, Action } from "redux";

import { SOCKET_STATE_CHANGED, SOCKET_CONNECTED, SOCKET_DISCONNECTED } from "./actions";
import { ISocketState, SocketStatus } from "./interfaces";


interface IAction extends Action {
  payload: ISocketState,
}

const INITIAL_STATE = {
  status: SocketStatus.Disconnected,
  wsURL: '',
  isError: false,
};

const socketReducer: Reducer<ISocketState, IAction> = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case SOCKET_STATE_CHANGED:
      return {
        ...state,
        status: payload.status,
        isError: payload.isError,
        wsURL: payload.wsURL || state.wsURL,
      }
    case SOCKET_CONNECTED:
      return {
        ...state,
        status: SocketStatus.Connected,
        isError: false,
      }
    case SOCKET_DISCONNECTED:
      return {
        ...state,
        status: SocketStatus.Disconnected,
        isError: false,
      }
    default:
      return state;
  }
}
export default socketReducer;

