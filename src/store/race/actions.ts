import { Dispatch } from "redux";

import { IRaceState, IRobot } from "./interfaces";

export const RACE_STATE = "ROBORACE/STATE";
export const RACE_TIME = "ROBORACE/TIME";
export const RACE_TIME_LIMIT = "ROBORACE/RACE_TIME_LIMIT";
export const RACE_ROBOT = "ROBORACE/ROBOT";
export const REMOVE_ROBOT = "ROBORACE/REMOVE_ROBOT";
export const ADMIN_STATE = "ROBORACE/ADMIN_STATE";
export const MANAGER_STATE = "ROBORACE/MANAGER_STATE";

export const setRaceState = (
  status: IRaceState["status"],
  dispatch: Dispatch
) => {
  dispatch({ type: RACE_STATE, status });
};

export const setRaceTime = (time: IRaceState["time"], dispatch: Dispatch) => {
  dispatch({ type: RACE_TIME, time });
};

export const setRaceTimeLimit = (raceTimeLimit: IRaceState["raceTimeLimit"], dispatch: Dispatch) => {
  dispatch({ type: RACE_TIME_LIMIT, raceTimeLimit });
};

export const setRobot = (robot: IRobot, dispatch: Dispatch) => {
  dispatch({ type: RACE_ROBOT, robots: [robot] });
};

export const removeRobor = (serial: IRobot["serial"], dispatch: Dispatch) => {
  dispatch({ type: REMOVE_ROBOT, serial });
};

export const setIsAdmin = (isAdmin: boolean) => (dispatch: Dispatch) => {
  dispatch({ type: ADMIN_STATE, isAdmin });
};

export const setIsManager = (isManager: boolean) => (dispatch: Dispatch) => {
  
  dispatch({ type: MANAGER_STATE, isManager });
};

export const checkAdmin = () => (dispatch: Dispatch) => {
  const traTaTa = localStorage.getItem("tra-ta-ta");
  if (traTaTa === "-544719056") {
    dispatch({ type: ADMIN_STATE, isAdmin: true });
  }
};
