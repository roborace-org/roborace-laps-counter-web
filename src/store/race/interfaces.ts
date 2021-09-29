import { Dispatch, AnyAction } from "redux";

export enum RaceStatus {
  READY = "READY",
  STEADY = "STEADY",
  RUNNING = "RUNNING",
  FINISH = "FINISH"
}

export enum MessageType {
  STATE = "STATE",
  LAP = "LAP",
  TIME = "TIME",
  ROBOT_REMOVE = "ROBOT_REMOVE"
}

interface BaseSocketMessage {
  type: MessageType;
}

export interface StateSocketMessage extends BaseSocketMessage {
  type: MessageType.STATE;
  state: RaceStatus;
}

export interface LapSocketMessage extends BaseSocketMessage, IRobot {
  type: MessageType.LAP;
}

export interface TimeSocketMessage extends BaseSocketMessage {
  raceTimeLimit: number;
  type: MessageType.TIME;
  time: number;
}

export interface RemoveSocketMessage extends BaseSocketMessage {
  type: MessageType.ROBOT_REMOVE;
  serial: number;
}

export interface IRobot {
  serial: number;
  num: number;
  laps: number;
  time: number;
  place: number;
  name: string;
  pitStopFinishTime: number;
}

export interface IRaceState {
  raceTimeLimit: number;
  status: RaceStatus | null;
  robots: IRobot[];
  time: number;
  isAdmin: boolean;
  isManager: boolean;
}

export type SocketMessage =
  | StateSocketMessage
  | LapSocketMessage
  | TimeSocketMessage
  | RemoveSocketMessage;
