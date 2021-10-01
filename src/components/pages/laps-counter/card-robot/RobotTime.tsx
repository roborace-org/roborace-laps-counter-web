import React, { FunctionComponent, useState, useEffect } from 'react';

import { msToTime } from '../../../../utils';
import { IRaceState, IRobot } from '../../../../store/race/interfaces';
import { setTimeout } from 'timers';

// Interval - component render time
const interval: number = 10

interface RobotTimeProps {
  time: IRobot['time'],
  pitStopFinishTime: IRobot['pitStopFinishTime']
  race: IRaceState;
}

const RobotTime: FunctionComponent<RobotTimeProps> = (props) => {
  const [timeInMs, setTime] = useState<number>(0);
  const [sync, setSync] = useState<boolean>(false);

  // synchronize time
  useEffect(() => {
    setSync(true)
  }, [props.pitStopFinishTime, props.race.time])

  useEffect(() => {
    if (props.pitStopFinishTime - props.race.time - timeInMs > 0) {
      setTimeout(() => {
        if (sync) {
          setTime(0)
          setSync(false)
        } else {
          setTime(timeInMs + interval)
        }
      }, interval)
    }
  })

  return (
    <div className="race-table-cell time">
      <div>
        <span className="mobile-view">Time:&nbsp;</span>
        <p className="line"><span>{msToTime(props.time)}</span></p>
        <span className="mobile-view">Pitstop:&nbsp;</span>
        <p className="line"><span>Pitstop:{
            (props.pitStopFinishTime - props.race.time - timeInMs) > 0
              ?  msToTime(props.pitStopFinishTime - props.race.time - timeInMs)
              : '-'
          }
          </span></p>
      </div>
    </div>
  );
};

export default RobotTime;