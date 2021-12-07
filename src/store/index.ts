import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import raceReduser from "./race/reduser";
import socketSlice from "./socket/reduser";

export const store = configureStore({
  reducer: {
    race: raceReduser,
    socket: socketSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// export const connectSocket =
//   (wsURL: string) =>
//   (dispatch: Dispatch, getState: Function, { socket }: { socket: Socket }) => {
//     socket.disconnect();
//     const socketIOClient = socket.connect(wsURL);

//     dispatch({
//       type: SOCKET_STATE_CHANGED,
//       payload: { wsURL, status: SocketStatus.Connecting, isError: false },
//     });
//     socketIOClient.onopen = () => {
//       socketIOClient.send(JSON.stringify({ type: "LAPS" }));
//       onConnected(dispatch);
//     };

//     socketIOClient.onerror = () => onError(dispatch);
//     socketIOClient.onclose = () => onDisconnect(dispatch);
//     socketIOClient.onmessage = (messageEvent: MessageEvent) => {
//       const message: SocketMessage = JSON.parse(messageEvent.data);
//       return onMessage(message, dispatch);
//     };
//   };
