import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISocketState, SocketStatus } from "./interfaces";

const initialState: ISocketState = {
  status: SocketStatus.Disconnected,
  wsURL: "ws://laps.roborace.org:8888/ws",
  isError: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnect: (state, action: PayloadAction<SocketStatus>) => {
      state.status = action.payload;
    },
    // raceStatus: (state, action: PayloadAction<IRaceState["status"]>) => {
    //   state.status = action.payload;
    // },
  },
});

export default socketSlice.reducer;
export const { socketConnect } = socketSlice.actions;
