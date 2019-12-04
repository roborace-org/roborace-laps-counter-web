import React, { FunctionComponent } from 'react';

import { IRobot } from '../../../../store/race/interfaces';


interface RobotLapsProps {
  laps: IRobot['laps'];
}

const RobotLaps: FunctionComponent<RobotLapsProps> = (props) => {
  return (
    <div className="race-table-cell laps">
      <span className="mobile-view">Laps:&nbsp;</span><span>{props.laps}</span>
    </div>
  );
};

export default RobotLaps;