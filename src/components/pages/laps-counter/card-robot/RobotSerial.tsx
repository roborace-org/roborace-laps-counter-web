import React, { FunctionComponent } from 'react';

import { IRobot } from '../../../../store/race/interfaces';


interface RobotLapsProps {
  serial: IRobot['serial'];
}

const RobotSerial: FunctionComponent<RobotLapsProps> = (props) => {
  return (
    <div className="race-table-cell serial">
      <span className="mobile-view">Serial:&nbsp;</span><span>{props.serial}</span>
    </div>
  );
};

export default RobotSerial;