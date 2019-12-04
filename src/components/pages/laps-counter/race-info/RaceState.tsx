import React, { FunctionComponent, Component } from "react";

import { IRaceState } from "../../../../store/race/interfaces";
import { connect } from "react-redux";
import { Button } from "antd";
import { sendMessage } from "../../../../store/socket/actions";

interface IAppProps {
  status: IRaceState["status"];
  isAdmin: boolean;
}

const RaceState: FunctionComponent<IAppProps> = props => {
  const { status, isAdmin } = props;

  const value = isAdmin ? (
    <RaceStateAdminWrapper />
  ) : (
    <div className="value">{status || "NOT CONNECTED"}</div>
  );

  return (
    <div className="laps-counter-info">
      <div className="title">Race state:</div>
      {value}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  isAdmin: state.race.isAdmin
});

export default connect(mapStateToProps)(RaceState);

class RaceStateAdmin extends Component<any, any> {
  getData(status) {
    switch (status) {
      case "RUNNING":
        return {
          label: "FINISH",
          command: "FINISH"
        };
      case "FINISH":
        return {
          label: "READY",
          command: "READY"
        };
      case "READY":
        return {
          label: "STEADY",
          command: "STEADY"
        };
      case "STEADY":
        return {
          label: "GO",
          command: "RUNNING"
        };
      default:
        return {
          label: "GO",
          command: "RUNNING"
        };
    }
  }

  sendCommand = state => {
    this.props.sendMessage({
      state,
      type: "COMMAND"
    });
  };

  public render() {
    const atata = this.getData(this.props.race.status);
    return (
      <Button
        type="primary"
        onClick={() => this.sendCommand(atata.command)}
        size={"large"}
      >
        {atata.label}
      </Button>
    );
  }
}

const mapStateToProps2 = (state: any) => ({
  race: state.race
});

const mapDispatchToProps = {
  sendMessage
};

const RaceStateAdminWrapper = connect(
  mapStateToProps2,
  mapDispatchToProps
)(RaceStateAdmin);
