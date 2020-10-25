import React, { FunctionComponent } from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { cmp } from 'type-comparator';

import { IRobot } from '../../../../store/race/interfaces';
import { CardRobot } from '../card-robot/CardRobot';


interface IAppProps {
  robots: IRobot[];
  isSingle?: Boolean;
  isAdmin: Boolean;
}

const RaceTable: FunctionComponent<IAppProps> = (props) => {
  const { robots, isAdmin } = props;
  const comparator = cmp().map(r => r.place).asc();
  const robotsCards = ((isAdmin ? robots : robots.sort(comparator))
    .map(robot => (
      <CardRobot key={robot.serial} robot={robot} isSingle={props.isSingle}/>
    )));

  let tableBody = (
    <FlipMove className="race-table-body">
      {robotsCards}
    </FlipMove>
  );

  if (!robotsCards.length) {
    tableBody = <div className="race-table-body race-table-empty"><div></div></div>
  }

  return (
    <div className="race-table">
      <div className="race-table-header">
        <div className="race-table-row">
          <div className="race-table-cell place">Place</div>
          <div className="race-table-cell name">Team/Robot</div>
          <div className="race-table-cell serial">Serial</div>
          <div className="race-table-cell laps">Laps</div>
          <div className="race-table-cell time">Time</div>
        </div>
      </div>
      {tableBody}
    </div >
  );
};

// export default RaceTable;

const mapStateToProps = (state: any) => ({ isAdmin : state.race.isAdmin });

export default connect(
  mapStateToProps,
)(RaceTable)