import * as React from "react";
import { connect } from "react-redux";
import { Button } from "antd";

import "./LapsCounter.scss";
import { IRaceState } from "../../store/race/interfaces";
import { ISocketState } from "../../store/socket/interfaces";
import RaceInfo from "../../components/pages/laps-counter/race-info/RaceInfo";
import RaceTable from "../../components/pages/laps-counter/race-table/RaceTable";
import { checkAdmin } from "../../store/race/actions";
import { sendMessage } from "../../store/socket/actions";

export interface IAppProps {
  socketState: ISocketState;
  race: IRaceState;
  checkAdmin: any;
  sendMessage: any;
}
export interface IAppState {}

class LapsCounter extends React.Component<IAppProps, IAppState> {
  componentDidMount() {
    this.props.checkAdmin();
  }

  enterLoading = () => {
    let serial = 100;
    if (this.props.race.robots.length) {
      serial = Math.max(...this.props.race.robots.map(r => r.serial)) + 1;
    }

    this.props.sendMessage({
      serial,
      name: `New ${serial}`,
      type: "ROBOT_INIT"
    });
  };

  public render() {
    return (
      <div className="laps-counter">
        <RaceInfo socketState={this.props.socketState} race={this.props.race} />
        <RaceTable robots={this.props.race.robots} />
        {this.props.race.isAdmin && (
          <Button type="primary" onClick={this.enterLoading}>
            Add
          </Button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  socketState: state.socketState,
  race: state.race
});

const mapDispatchToProps = {
  checkAdmin,
  sendMessage
};
export default connect(mapStateToProps, mapDispatchToProps)(LapsCounter);
