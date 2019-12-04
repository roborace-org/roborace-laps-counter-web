import React, { FunctionComponent } from 'react';

import { msToTime } from '../../../../utils';
import { IRobot } from '../../../../store/race/interfaces';


interface RobotTimeProps {
  time: IRobot['time']
}

const RobotTime: FunctionComponent<RobotTimeProps> = (props) => {
  return (
    <div className="race-table-cell time">
      <span className="mobile-view ">Time:&nbsp;</span><span>{msToTime(props.time)}</span>
    </div>
  );
};

export default RobotTime;