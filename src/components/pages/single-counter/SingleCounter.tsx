import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, Button } from "antd";
import { sendMessage } from "../../../store/socket/actions";
import { connect } from "react-redux";
import { msToTime } from "../../../utils";
import { CardRobot } from "../laps-counter/card-robot/CardRobot";
import RaceTable from "../laps-counter/race-table/RaceTable";


export interface IAppProps {}
export interface IAppState {}

class SingleCounter extends Component<any, IAppState> {

    public render() {
        const myCurrentRobot = this.props.robots.find(r => r.serial === +this.props.match.params.serial)
        console.log(myCurrentRobot);
        console.log(this.props.isSingle);
        return (
            <Form layout="inline">
                { myCurrentRobot && <RaceTable robots={[myCurrentRobot]} isSingle={true}/> }
            </Form>
        );
    }
}
const mapStateToProps = (state) => ({
    robots: state.race.robots
}) 
const mapDispatchToProps: any = {
    sendMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(SingleCounter)
)