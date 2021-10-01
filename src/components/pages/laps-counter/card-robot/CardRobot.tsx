import React, { Component } from 'react';

import './CardRobot.scss'
import { IRaceState, IRobot } from '../../../../store/race/interfaces';
import RobotPlace from './RobotPlace';
import RobotName from './RobotName';
import RobotLaps from './RobotLaps';
import RobotTime from './RobotTime';
import RobotSerial from './RobotSerial';
import { connect } from 'react-redux';


export interface IAppProps {
  robot: IRobot;
  isSingle? : Boolean;
  race: IRaceState;
}

export class CardRobot extends Component<IAppProps, any> {
  render() {
    const { robot } = this.props;
    if (this.props.race.isAdmin || this.props.race.isManager) {
      return (
        <div className="card-robot race-table-row" >
          <RobotName robot={robot} isSingle={this.props.isSingle}/>
          <RobotSerial serial={robot.serial} />
          <RobotLaps laps={robot.laps} />
          <RobotTime time={robot.time} pitStopFinishTime={robot.pitStopFinishTime} race={this.props.race}/>
        </div>
      );
    }
    return (
      <div className="card-robot race-table-row" >
        <RobotPlace place={robot.place} />
        <RobotName robot={robot} isSingle={this.props.isSingle}/>
        <RobotSerial serial={robot.serial} />
        <RobotLaps laps={robot.laps} />
        <RobotTime time={robot.time} pitStopFinishTime={robot.pitStopFinishTime} race={this.props.race}/>
      </div>
    );
  }
}