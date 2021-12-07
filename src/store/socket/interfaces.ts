import { IRobot, RaceStatus } from "../race/interfaces";

export enum SocketStatus {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
}

export interface ISocketState {
  status: SocketStatus;
  isError?: boolean;
  wsURL: string;
}

export enum MessageType {
  STATE = "STATE",
  LAP = "LAP",
  TIME = "TIME",
  ROBOT_REMOVE = "ROBOT_REMOVE",
}

interface IBaseSocketMessage {
  type: MessageType;
}

export interface IStateSocketMessage extends IBaseSocketMessage {
  type: MessageType.STATE;
  state: RaceStatus;
}

export interface ITimeSocketMessage extends IBaseSocketMessage {
  type: MessageType.TIME;
  raceTimeLimit: number;
  time: number;
}

export interface ILapSocketMessage extends IBaseSocketMessage, IRobot {
  type: MessageType.LAP;
}

export interface IRemoveSocketMessage extends IBaseSocketMessage {
  type: MessageType.ROBOT_REMOVE;
  serial: number;
}

export type SocketMessage =
  | IStateSocketMessage
  | ITimeSocketMessage
  | ILapSocketMessage
  | IRemoveSocketMessage;
