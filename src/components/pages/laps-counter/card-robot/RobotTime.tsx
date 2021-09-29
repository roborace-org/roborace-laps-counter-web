import React, { FunctionComponent } from 'react';

import { msToTime } from '../../../../utils';
import { IRaceState, IRobot } from '../../../../store/race/interfaces';


interface RobotTimeProps {
  time: IRobot['time'],
  pitStopFinishTime: IRobot['pitStopFinishTime']
  race: IRaceState;
}

const RobotTime: FunctionComponent<RobotTimeProps> = (props) => {
  return (
    <div className="race-table-cell time">
      <div>
        <span className="mobile-view">Time:&nbsp;</span>
        <p className="line"><span>{msToTime(props.time)}</span></p>
        <span className="mobile-view">Pitstop:&nbsp;</span>
        <p className="line"><span>Pitstop:{(props.pitStopFinishTime - props.race.time) > 0 ? msToTime(props.pitStopFinishTime - props.race.time):'-'}</span></p>
      </div>
    </div>
  );
};

export default RobotTime;