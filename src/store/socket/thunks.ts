import { AppDispatch, AppThunk } from "..";
import {
  raceRobot,
  setRaceStatus,
  raceTime,
  raceTimeLimit,
  removeRobot,
} from "../race/reduser";
import { MessageType, SocketMessage, SocketStatus } from "./interfaces";
import { socketConnect } from "./reduser";
import socket from "./socket";

let publicSocket!: WebSocket;

export const disconnectSocket = () => {
  socket.disconnect();
};

export const connectSocket =
  (wsURL: string): AppThunk =>
  (dispatch) => {
    socket.disconnect();
    publicSocket = socket.connect(wsURL);

    publicSocket.onopen = () => {
      publicSocket.send(JSON.stringify({ type: "LAPS" }));
      dispatch(socketConnect(SocketStatus.Connected));
    };
    publicSocket.onclose = () =>
      dispatch(socketConnect(SocketStatus.Disconnected));
    publicSocket.onerror = () =>
      dispatch(socketConnect(SocketStatus.Disconnected));

    publicSocket.onmessage = (messageEvent: MessageEvent) => {
      const message: SocketMessage = JSON.parse(messageEvent.data);
      return onMessage(message, dispatch);
    };
  };

// async function asyncForEach<T>(
//   items: T[],
//   callback: (item: T, idx: number) => Promise<void | void[]>
// ) {
//   for (const [idx, element] of items.entries()) {
//     await callback(element, idx);
//   }
// }

// const asyncSendMessage = (
//   dispatch: AppDispatch,
//   data: Record<string, unknown>
// ) => {
//   return new Promise<void>((resolve) => {
//     dispatch(sendMessage(data));
//     setTimeout(() => {
//       resolve();
//     }, 300);
//   });
// };

export const setNewRobots =
  (robotsStr: string): AppThunk =>
  async (dispatch, getState) => {
    const robots = getState().race.robots;

    const newRobots = robotsStr.split("\n").reduce<string[]>((acc, curr) => {
      const r = curr.trim();
      if (!!r) {
        acc.push(r);
      }
      return acc;
    }, []);

    const removedRobots = [...robots];

    removedRobots.reverse().forEach((robot) => {
      dispatch(
        sendMessage({
          serial: robot.serial,
          type: "ROBOT_REMOVE",
        })
      );
    });
    // await asyncForEach<IRobot>(removedRobots.reverse(), (robot) => {
    //   return asyncSendMessage(dispatch, {
    //     serial: robot.serial,
    //     type: "ROBOT_REMOVE",
    //   });
    // });

    newRobots.forEach((name, idx) => {
      dispatch(
        sendMessage({
          serial: idx + 1,
          name,
          type: "ROBOT_INIT",
        })
      );
    });
    // await asyncForEach<string>(newRobots, (name, idx) => {
    //   return Promise.all([
    //     asyncSendMessage(dispatch, {
    //       serial: idx + 1,
    //       name,
    //       type: "ROBOT_INIT",
    //     }),
    //   ]);
    // });
  };

export const sendMessage =
  (data: Record<string, unknown>): AppThunk =>
  () => {
    publicSocket.send(JSON.stringify(data));
  };

const onMessage = (message: SocketMessage, dispatch: AppDispatch) => {
  switch (message.type) {
    case MessageType.STATE: {
      dispatch(setRaceStatus(message.state));
      break;
    }
    case MessageType.TIME: {
      dispatch(raceTime(message.time));
      dispatch(raceTimeLimit(message.raceTimeLimit));
      break;
    }
    case MessageType.LAP: {
      const { type, ...robot } = message;
      dispatch(raceRobot(robot));
      break;
    }
    case MessageType.ROBOT_REMOVE: {
      dispatch(removeRobot(message.serial));
      break;
    }
    default:
      break;
  }
};
