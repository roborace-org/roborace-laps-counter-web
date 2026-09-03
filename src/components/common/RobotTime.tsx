import { makeStyles, Theme } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";
import React, { useContext } from "react";
import { RealRaceTimeContext } from "../../contexts/RealRaceTimeContext";
import { msToTime } from "../../helpers/fns";
import { IRobot } from "../../store/race/interfaces";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 265,
    [theme.breakpoints.down("md")]: {
      width: 135,
    },
  },
  timeContainer: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  time: {
    fontSize: 50,
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
    },
  },
  serverTimeRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  serverTime: {
    fontSize: 24,
    opacity: 0.6,
    [theme.breakpoints.down("md")]: {
      fontSize: 14,
    },
  },
  pendingIcon: {
    fontSize: 18,
    color: "#ff9800",
    animation: "$spin 1.5s linear infinite",
    [theme.breakpoints.down("md")]: {
      fontSize: 14,
    },
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  pitstopContainer: {
    display: "flex",
    color: "#777777",
    fontSize: 24,
    fontWeight: 500,
    [theme.breakpoints.down("md")]: {
      fontSize: 18,
    },
  },
  pitstopTitle: {
    marginRight: 4,
  },
  pitstopTime: {},
}));

interface RobotTimeProps {
  robot: IRobot;
  pendingTime?: number;
  hasPending?: boolean;
}

const RobotTime: React.FC<RobotTimeProps> = ({ robot, pendingTime, hasPending = false }) => {
  const classes = useStyles();
  const realRaceTime = useContext(RealRaceTimeContext);

  const hasPitStop =
    robot.pitStopFinishTime && robot.pitStopFinishTime > realRaceTime;
  
  const displayTime = hasPending && pendingTime !== undefined ? pendingTime : robot.time;
  
  return (
    <div className={classes.root}>
      <div className={classes.timeContainer}>
        <div className={classes.time}>{msToTime(displayTime)}</div>
        {hasPending && <Schedule className={classes.pendingIcon} />}
      </div>
      {hasPending && (
        <div className={classes.serverTimeRow}>
          <span className={classes.serverTime}>server: {msToTime(robot.time)}</span>
        </div>
      )}
      {!!hasPitStop && (
        <div className={classes.pitstopContainer}>
          <div className={classes.pitstopTitle}>Pitstop: </div>
          <div className={classes.pitstopTime}>
            <RobotPitStopTime pitStopFinishTime={robot.pitStopFinishTime} />
          </div>
        </div>
      )}
    </div>
  );
};
export default RobotTime;

const RobotPitStopTime: React.FC<{ pitStopFinishTime: number }> = ({
  pitStopFinishTime,
}) => {
  const realRaceTime = useContext(RealRaceTimeContext);
  const pitstopTime =
    pitStopFinishTime && pitStopFinishTime > realRaceTime
      ? msToTime(pitStopFinishTime - realRaceTime)
      : "-";
  return <>{pitstopTime}</>;
};
