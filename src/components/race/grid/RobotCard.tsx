import React, { useMemo } from "react";
import { Grid, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { getColorsByPlace } from "../../../helpers/fns";
import { IRobot } from "../../../store/race/interfaces";
import RobotIcon from "../../common/RobotIcon";
import RobotTime from "../../common/RobotTime";
import { TUseGridStyles } from "./style";
import clsx from "clsx";

interface IRobotCardProps {
  robot: IRobot;
  classes: TUseGridStyles;
}
const useStyles = makeStyles({
  color: {
    color: (props?: any) => (props.color ? props.color : "#000000"),
  },
  bgColor: {
    backgroundColor: (props?: any) =>
      props.bgColor ? props.bgColor : "transparent",
  },
});

const RobotCard: React.FC<IRobotCardProps> = ({ robot, classes }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const { color, bgColor } = useMemo(() => {
    return getColorsByPlace(robot.place);
  }, [robot.place]);

  const colorClasses = useStyles({ color, bgColor });

  return (
    <div className={clsx(classes.card, colorClasses.color)}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
      >
        <Grid item xs>
          <Grid container spacing={2} alignItems="center">
            <Grid item style={{ overflow: "hidden" }}>
              <div
                className={classes.name}
              >{`(№${robot.place}) ${robot.name}`}</div>
            </Grid>
            <Grid item className={classes.icon}>
              <RobotIcon color={color} text={"" + robot.serial} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={xs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs className={classes.laps}>
              {`Laps: ${robot.laps}`}
            </Grid>
            <Grid item>
              <RobotTime robot={robot} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RobotCard;
