import { makeStyles } from "@material-ui/core";
import React from "react";
import { ReactComponent as RobotIconSvg } from "../../assets/robot.svg";

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: 74,
    "& svg": {
      width: "100%",
    },
  },
  text: {
    position: "absolute",
    fontSize: 32,
    fontWeight: "bold",
    right: "32%",
    top: "14px",
    width: 40,
    textAlign: "center",
    color: (props: any) => props.color,
  },
});

interface IRobotIconProps {
  color?: string;
  text?: string;
}

const RobotIcon: React.FC<IRobotIconProps> = ({ color = "#000000", text }) => {
  const classes = useStyles({ color });
  return (
    <div className={classes.root}>
      <RobotIconSvg fill={color} />

      {!!text && (
        <div className={classes.text}>{`${text}`.substring(0, 2)}</div>
      )}
    </div>
  );
};

export default RobotIcon;
