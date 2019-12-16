import { Dispatch } from "redux";

import Socket from "./Socket";
import {
  setRaceState as setRaceStatus,
  setRaceTime,
  setRobot,
  removeRobor
} from "../race/actions";
import { SocketStatus } from "./interfaces";
import { SocketMessage, MessageType } from "../race/interfaces";

export const SOCKET_STATE_CHANGED = "SOCKET/CONNECTION-STATE";
export const SOCKET_CONNECTED = "SOCKET/CONNECT";
export const SOCKET_DISCONNECTED = "SOCKET/DISCONNECT";
export const ROBORACE_STATE = "ROBORACE/STATE";

export const disconnectSocket = () => (
  dispatch: Dispatch,
  getState: Function,
  { socket }: { socket: Socket }
) => {
  socket.disconnect();
};

export const sendMessage = data => (
  dispatch: Dispatch,
  getState: Function,
  { socket }: { socket: Socket }
) => {
  socket.send(JSON.stringify(data));
};

export const connectSocket = (wsURL: string) => (
  dispatch: Dispatch,
  getState: Function,
  { socket }: { socket: Socket }
) => {
  socket.disconnect();
  const socketIOClient = socket.connect(wsURL);

  dispatch({
    type: SOCKET_STATE_CHANGED,
    payload: { wsURL, status: SocketStatus.Connecting, isError: false }
  });
  socketIOClient.onopen = () => {
    socketIOClient.send(JSON.stringify({ type: "LAPS" }));
    onConnected(dispatch);
  };

  socketIOClient.onerror = () => onError(dispatch);
  socketIOClient.onclose = () => onDisconnect(dispatch);
  socketIOClient.onmessage = (messageEvent: MessageEvent) => {
    const message: SocketMessage = JSON.parse(messageEvent.data);
    return onMessage(message, dispatch);
  };
};

const onMessage = (message: SocketMessage, dispatch: Dispatch) => {
  switch (message.type) {
    case MessageType.STATE:
      setRaceStatus(message.state, dispatch);
      break;
    case MessageType.TIME:
      setRaceTime(message.time, dispatch);
      break;
    case MessageType.LAP:
      const { type, ...robot } = message;
      setRobot(robot, dispatch);
      break;
    case MessageType.ROBOT_REMOVE:
      removeRobor(message.serial, dispatch);
      break;
    default:
      break;
  }
};

const onError = (dispatch: Dispatch) => {
  dispatch({
    type: SOCKET_STATE_CHANGED,
    payload: { status: SocketStatus.Connecting, isError: true }
  });
};

const onDisconnect = (dispatch: Dispatch) => {
  dispatch({ type: SOCKET_DISCONNECTED });
};

const onConnected = (dispatch: Dispatch) => {
  dispatch({ type: SOCKET_CONNECTED });
};
