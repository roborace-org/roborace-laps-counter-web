import React, { useMemo } from "react";
import RaceTable from "./table/RaceTable";
import { asc, map } from "type-comparator";
import { useAppSelector } from "../../store";

const comparatorPlace = map((r) => r.place, asc);
const comparatorSerial = map((r) => r.serial, asc);

const RaceGridWrapper: React.FC<{ asAdmin?: boolean }> = ({
  asAdmin = false,
}) => {
  const robotState = useAppSelector((state) => state.race.robots);

  const robots = useMemo(() => {
    const comparator = asAdmin ? comparatorSerial : comparatorPlace;
    return robotState.slice().sort(comparator);
  }, [robotState, asAdmin]);

  return <RaceTable robots={robots} asAdmin={asAdmin} />;
};

export default RaceGridWrapper;
