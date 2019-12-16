import React, { Component } from 'react';

import './CardRobot.scss'
import { IRobot } from '../../../../store/race/interfaces';
import RobotPlace from './RobotPlace';
import RobotName from './RobotName';
import RobotLaps from './RobotLaps';
import RobotTime from './RobotTime';
import RobotSerial from './RobotSerial';


export interface IAppProps {
  robot: IRobot;
}

export class CardRobot extends Component<IAppProps> {
  render() {
    const { robot } = this.props;
    return (
      <div className="card-robot race-table-row" >
        <RobotPlace place={robot.place} />
        <RobotName robot={robot} />
        <RobotSerial serial={robot.serial} />
        <RobotLaps laps={robot.laps} />
        <RobotTime time={robot.time} />
      </div>
    );
  }
}
