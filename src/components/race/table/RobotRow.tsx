import { Button, Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useCallback, useMemo } from "react";
import { getColorsByPlace, msToTime } from "../../../helpers/fns";
import { useAppDispatch, useAppSelector } from "../../../store";
import { IRobot, RaceStatus } from "../../../store/race/interfaces";
import { sendMessage } from "../../../store/socket/thunks";
import RobotIcon from "../../common/RobotIcon";
import RobotTime from "../../common/RobotTime";
import { TUseTableStyles } from "./style";

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
  const colorClasses = useStyles({ color, bgColor });

  const addLap = useCallback(() => {
    dispatch(
      sendMessage({
        serial: robot.serial,
        type: "LAP_MAN",
        laps: 1,
      })
    );
  }, [robot.serial, dispatch]);

  const removeLap = useCallback(() => {
    dispatch(
      sendMessage({
        serial: robot.serial,
        type: "LAP_MAN",
        laps: -1,
      })
    );
  }, [robot.serial, dispatch]);

  const pitStop = useCallback(() => {
    dispatch(
      sendMessage({
        serial: robot.serial,
        type: "PIT_STOP",
      })
    );
  }, [robot.serial, dispatch]);

  return (
    <div className={clsx(classes.row, classes.rowCell, colorClasses.color)}>
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
        <div className={clsx(classes.cellValue, classes.cellValueCenter)}>
          {robot.laps}
        </div>
      </div>
      <div className={clsx(classes.cell, classes.time)}>
        <RobotTime robot={robot} />
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
