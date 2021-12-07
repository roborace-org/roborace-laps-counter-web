import React from "react";
import FlipMove from "react-flip-move";
import useTableStyles from "./style";
import clsx from "clsx";
import RobotRow from "./RobotRow";
import { IRobot, RaceStatus } from "../../../store/race/interfaces";
import { useMediaQuery } from "@material-ui/core";
import { useAppSelector } from "../../../store";

const RaceTable: React.FC<{ robots: IRobot[]; asAdmin: boolean }> = ({
  robots,
  asAdmin,
}) => {
  const classes = useTableStyles({ count: robots.length });
  const showTime = useMediaQuery("(min-width:1500px)");
  const status = useAppSelector((state) => state.race.status);

  const content = robots.map((r) => (
    <div key={r.serial}>
      <RobotRow
        robot={r}
        classes={classes}
        asAdmin={asAdmin}
        showTime={showTime}
      />
    </div>
  ));

  return (
    <div>
      <div className={clsx(classes.row, classes.rowHeader)}>
        <div className={clsx(classes.cell, classes.place)}>
          Place {robots.length}
        </div>
        <div className={clsx(classes.cell, classes.name)}>Team/Robot</div>
        <div className={clsx(classes.cell, classes.serial)}>Serial</div>
        {asAdmin && (
          <div className={clsx(classes.cell, classes.action)}>Action</div>
        )}
        <div className={clsx(classes.cell, classes.laps)}>Laps</div>
        <div className={clsx(classes.cell, classes.time)}>Time</div>
        {showTime && (
          <>
            <div className={clsx(classes.cell, classes.times)}>Best Lap</div>
            <div className={clsx(classes.cell, classes.times)}>Last Lap</div>
          </>
        )}
      </div>

      {status === RaceStatus.RUNNING && (
        <FlipMove duration={500}>{content}</FlipMove>
      )}
      {status !== RaceStatus.RUNNING && (
        <div>
          <>{content}</>
        </div>
      )}
    </div>
  );
};

export default RaceTable;
