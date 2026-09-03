import { Button, Grid, makeStyles } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RealRaceTimeContext } from "../../../contexts/RealRaceTimeContext";
import { getColorsByPlace, msToTime } from "../../../helpers/fns";
import { useAppDispatch, useAppSelector } from "../../../store";
import { IRobot, RaceStatus } from "../../../store/race/interfaces";
import { addPendingLaps } from "../../../store/race/reduser";
import { queueLapManMessage, sendMessage } from "../../../store/socket/thunks";
import RobotIcon from "../../common/RobotIcon";
import RobotTimeDisplay from "../../common/RobotTime";
import { TUseTableStyles } from "./style";

const PENDING_DISPLAY_DELAY = 1000;

interface IRobotRowProps {
  robot: IRobot;
  classes: TUseTableStyles;
  asAdmin: boolean;
  showTime: boolean;
}
const useStyles = makeStyles({
  color: {
    color: (props?: any) => (props.color ? props.color : "#000000"),
    "& $bgColor": {
      color: "#404040",
    },
  },
  bgColor: {
    backgroundColor: (props?: any) =>
      props.bgColor ? props.bgColor : "transparent",
  },
  lapsChange: {
    fontSize: 20,
  },
  add: {
    backgroundColor: "#3f51b533",
  },
  remove: {
    backgroundColor: "#f500571a",
  },
  lapsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  serverLaps: {
    fontSize: "0.75em",
    opacity: 0.6,
  },
  pendingIcon: {
    fontSize: 18,
    color: "#ff9800",
    animation: "$spin 1.5s linear infinite",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});

const RobotRow: React.FC<IRobotRowProps> = ({
  robot,
  classes,
  asAdmin,
  showTime,
}) => {
  const dispatch = useAppDispatch();
  const { color, bgColor } = useMemo(() => {
    return getColorsByPlace(robot.place);
  }, [robot.place]);
  const raceState = useAppSelector((state) => state.race.status);
  const pendingQueue = useAppSelector((state) => state.race.pendingLapsQueue[robot.serial] || []);
  const colorClasses = useStyles({ color, bgColor });
  const realRaceTime = useContext(RealRaceTimeContext);
  const hasPitStop =
    robot.pitStopFinishTime && robot.pitStopFinishTime > realRaceTime;

  const pendingLapsDelta = pendingQueue.reduce((sum, item) => sum + item.delta, 0);
  const displayLaps = robot.laps + pendingLapsDelta;
  const hasPendingLaps = pendingQueue.length > 0;
  const displayTime = hasPendingLaps ? pendingQueue[pendingQueue.length - 1].time : robot.time;
  const oldestPendingAt = hasPendingLaps ? pendingQueue[0].addedAt : null;

  const [showPendingUI, setShowPendingUI] = useState(false);

  useEffect(() => {
    if (!hasPendingLaps) {
      setShowPendingUI(false);
      return;
    }

    const elapsed = Date.now() - (oldestPendingAt || Date.now());
    if (elapsed >= PENDING_DISPLAY_DELAY) {
      setShowPendingUI(true);
    } else {
      const timer = setTimeout(() => {
        setShowPendingUI(true);
      }, PENDING_DISPLAY_DELAY - elapsed);
      return () => clearTimeout(timer);
    }
  }, [hasPendingLaps, oldestPendingAt]);

  const addLap = useCallback(() => {
    dispatch(addPendingLaps({ serial: robot.serial, delta: 1, time: realRaceTime }));
    queueLapManMessage({
      serial: robot.serial,
      type: "LAP_MAN",
      laps: 1,
    });
  }, [robot.serial, dispatch, realRaceTime]);

  const removeLap = useCallback(() => {
    dispatch(addPendingLaps({ serial: robot.serial, delta: -1, time: realRaceTime }));
    queueLapManMessage({
      serial: robot.serial,
      type: "LAP_MAN",
      laps: -1,
    });
  }, [robot.serial, dispatch, realRaceTime]);

  const pitStop = useCallback(() => {
    dispatch(
      sendMessage({
        serial: robot.serial,
        type: "PIT_STOP",
      })
    );
  }, [robot.serial, dispatch]);

  return (
    <div
      className={clsx(classes.row, classes.rowCell, colorClasses.color, {
        [classes.pitstopRow]: hasPitStop,
      })}
    >
      <div className={clsx(classes.cell, classes.place, colorClasses.bgColor)}>
        <div
          className={clsx(classes.cellValue, classes.cellValueCenter)}
        >{`№${robot.place}`}</div>
      </div>
      <div className={clsx(classes.cell, classes.name)}>
        <div className={clsx(classes.cellValue, classes.nameValue)}>
          {robot.name}
        </div>
      </div>
      <div className={clsx(classes.cell, classes.serial)}>
        <RobotIcon color={color} text={"" + robot.serial} />
      </div>
      {asAdmin && (
        <div className={clsx(classes.cell, classes.action)}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                size="small"
                className={clsx(colorClasses.lapsChange, colorClasses.add)}
                disabled={raceState !== RaceStatus.RUNNING}
                onClick={addLap}
              >
                +
              </Button>
            </Grid>
            {/* <Grid item xs={2} /> */}
            <Grid item xs={6}>
              <Button
                fullWidth
                color="secondary"
                variant="outlined"
                size="small"
                className={clsx(colorClasses.lapsChange, colorClasses.remove)}
                disabled={raceState !== RaceStatus.RUNNING}
                onClick={removeLap}
              >
                -
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="default"
                variant="outlined"
                size="small"
                disabled={raceState !== RaceStatus.RUNNING}
                onClick={pitStop}
              >
                Pitstop
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
      <div className={clsx(classes.cell, classes.laps)}>
        <div className={clsx(classes.cellValue, classes.cellValueCenter, colorClasses.lapsContainer)}>
          {displayLaps}
          {showPendingUI && (
            <>
              <span className={colorClasses.serverLaps}>({robot.laps})</span>
              <Schedule className={colorClasses.pendingIcon} />
            </>
          )}
        </div>
      </div>
      <div className={clsx(classes.cell, classes.time)}>
        <RobotTimeDisplay robot={robot} pendingTime={displayTime} hasPending={showPendingUI} />
      </div>

      {showTime && (
        <>
          <div className={clsx(classes.cell, classes.times)}>
            <div className={clsx(classes.cellValue, classes.cellValueCenter)}>
              {msToTime(robot.bestLapTime)}
            </div>
          </div>
          <div className={clsx(classes.cell, classes.times)}>
            <div className={clsx(classes.cellValue, classes.cellValueCenter)}>
              {msToTime(robot.lastLapTime)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RobotRow;
