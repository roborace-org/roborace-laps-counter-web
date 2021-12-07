import React from "react";
import FlipMove from "react-flip-move";
import { IRobot } from "../../../store/race/interfaces";
import RobotCard from "./RobotCard";
import useGridStyles from "./style";

const RaceGrid: React.FC<{ robots: IRobot[] }> = ({ robots }) => {
  const classes = useGridStyles();

  return (
    <div className={classes.row}>
      <FlipMove>
        {robots.map((robot) => (
          <div key={robot.serial}>
            <RobotCard robot={robot} classes={classes} />
          </div>
        ))}
      </FlipMove>
    </div>
  );
};

export default RaceGrid;
