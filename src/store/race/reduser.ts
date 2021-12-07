import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRaceState, IRobot } from "./interfaces";

const initialState: IRaceState = {
  status: null,
  robots: [],
  raceTimeLimit: 0,
  time: 0,
  isAdmin: localStorage.getItem("uuuuuu") === "-544719056",
};

const receSlice = createSlice({
  name: "race",
  initialState,
  reducers: {
    setRaceStatus: (state, action: PayloadAction<IRaceState["status"]>) => {
      state.status = action.payload;
    },

    raceTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    },

    raceTimeLimit: (state, action: PayloadAction<number>) => {
      state.raceTimeLimit = action.payload;
    },

    raceRobot: (state, action: PayloadAction<IRobot>) => {
      const robot = action.payload;
      const robots = state.robots;
      const indexRobot = robots.findIndex((r) => r.serial === robot.serial);
      if (indexRobot === -1) {
        robots.push(robot);
      } else {
        robots[indexRobot] = robot;
      }
    },

    removeRobot: (state, action: PayloadAction<IRobot["serial"]>) => {
      const robots = state.robots;
      const removingIndexRobot = robots.findIndex(
        (r) => r.serial === action.payload
      );
      if (removingIndexRobot !== -1) {
        robots.splice(removingIndexRobot, 1);
      }
      state.robots = robots;
    },

    clearRobots: (state) => {
      state.robots = [...state.robots];
    },

    setAdmin: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        localStorage.setItem("uuuuuu", "-544719056");
      } else {
        localStorage.removeItem("uuuuuu");
      }
      state.isAdmin = action.payload;
    },
  },
});

export default receSlice.reducer;

export const {
  setRaceStatus,
  raceTime,
  raceTimeLimit,
  raceRobot,
  removeRobot,
  clearRobots,
  setAdmin,
} = receSlice.actions;
