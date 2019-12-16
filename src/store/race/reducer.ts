import { Reducer, Action } from "redux";

import {
  RACE_STATE,
  RACE_TIME,
  RACE_ROBOT,
  REMOVE_ROBOT,
  ADMIN_STATE
} from "./actions";
import { RaceStatus, IRaceState } from "./interfaces";

const INITIAL_STATE = {
  status: null,
  robots: [],
  time: 0,
  isAdmin: false
};

interface IAction extends Action, IRaceState {}

const raceReducer: Reducer<IRaceState, IAction> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case RACE_STATE:
      return {
        ...state,
        status: action.status
      };
    case RACE_TIME:
      return {
        ...state,
        time: action.time
      };
    case RACE_ROBOT:
      const robot = action.robots[0];
      const robots = state.robots;
      const indexRobot = robots.findIndex(r => r.serial === robot.serial);
      if (indexRobot === -1) {
        robots.push(robot);
      } else {
        robots[indexRobot] = robot;
      }
      return {
        ...state,
        robots: [...robots]
      };
    case REMOVE_ROBOT:
      const { serial } = action as any;
      const oldRobots = state.robots;
      const removingIndexRobot = oldRobots.findIndex(r => r.serial === serial);
      if (removingIndexRobot !== -1) {
        oldRobots.splice(removingIndexRobot, 1);
      }

      return {
        ...state,
        robots: [...oldRobots]
      };
    case ADMIN_STATE:
      localStorage.setItem("tra-ta-ta", "-544719056");
      return {
        ...state,
        isAdmin: action.isAdmin
      };
    default:
      return state;
  }
};
export default raceReducer;
