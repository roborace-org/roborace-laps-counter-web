export enum RaceStatus {
  READY = "READY",
  STEADY = "STEADY",
  RUNNING = "RUNNING",
  FINISH = "FINISH",
}

export interface IRobot {
  serial: number;
  num: number;
  laps: number;
  time: number;
  place: number;
  name: string;
  pitStopFinishTime: number;
  lastLapTime: number;
  bestLapTime: number;
}

export interface IRaceState {
  raceTimeLimit: number;
  time: number;
  status: RaceStatus | null;
  robots: IRobot[];
  isAdmin: boolean;
}
