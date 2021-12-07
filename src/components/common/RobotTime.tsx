import { makeStyles, Theme } from "@material-ui/core";
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
  time: {
    fontSize: 32,
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
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

const RobotTime: React.FC<{ robot: IRobot }> = ({ robot }) => {
  const classes = useStyles();
  const realRaceTime = useContext(RealRaceTimeContext);

  const hasPitStop =
    robot.pitStopFinishTime && robot.pitStopFinishTime > realRaceTime;
  return (
    <div className={classes.root}>
      <div className={classes.time}>{msToTime(robot.time)}</div>
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
