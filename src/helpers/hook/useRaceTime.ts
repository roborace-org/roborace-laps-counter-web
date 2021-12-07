import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store";
import { RaceStatus } from "../../store/race/interfaces";
const updateInterval = 100;
let timerId!: NodeJS.Timeout;

function useRealRaceTime() {
  const [raceTime, setRaceTime] = useState<number>(0);
  const { time, status } = useAppSelector((state) => ({
    time: state.race.time,
    status: state.race.status,
  }));

  const runTimer = useCallback(() => {
    timerId = setInterval(() => {
      setRaceTime((raceTime) => raceTime + updateInterval);
    }, updateInterval);
  }, []);

  useEffect(() => {
    timerId && clearInterval(timerId);
    setRaceTime(time);
    if (status === RaceStatus.RUNNING) {
      runTimer();
    }
  }, [time, runTimer, status]);

  return raceTime;
}

export default useRealRaceTime;
