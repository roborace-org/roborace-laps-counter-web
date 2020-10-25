import React, { FunctionComponent } from 'react';

import { IRobot } from '../../../../store/race/interfaces';
import { NavLink } from 'react-router-dom';


interface RobotLapsProps {
  serial: IRobot['serial'];
}

const RobotSerial: FunctionComponent<RobotLapsProps> = (props) => {
  return (
    <div className="race-table-cell serial">
      <span className="mobile-view">Serial:&nbsp;</span>
      <span>
        <NavLink exact to={`/single/${props.serial}`}>{props.serial}</NavLink>
        </span>
    </div>
  );
};

export default RobotSerial;