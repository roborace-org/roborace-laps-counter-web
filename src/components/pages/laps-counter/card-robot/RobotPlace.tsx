import React, { FunctionComponent } from 'react';

import { IRobot } from '../../../../store/race/interfaces';


interface RobotPlaceProps {
  place: IRobot['place'];
}

const RobotPlace: FunctionComponent<RobotPlaceProps> = (props) => {
  return (
    <div className={`race-table-cell place place-${props.place}`}>#{props.place}</div>
  );
};

export default RobotPlace;