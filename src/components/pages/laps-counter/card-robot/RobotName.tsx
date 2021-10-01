import React, { FunctionComponent, Component, PureComponent } from "react";
import { Form, Button } from "antd";

import { IRobot } from "../../../../store/race/interfaces";
import { InputWrapper } from "../../../common/input-wrapper/InputWrapper";
import { connect } from "react-redux";
import { sendMessage } from "../../../../store/socket/actions";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

interface RobotSerialProps {
  robot: IRobot;
  isSingle? : Boolean;
}
class RobotName extends PureComponent<RobotSerialProps, any> {
  public render() {
    const { robot, isAdmin, isManager } = this.props as any;
    const content = isAdmin ? (
      <RobotNameAdminForm robot={robot} isSingle={this.props.isSingle} isManager={isManager}/>
    ) : (
      <RobotNameUser robot={robot} />
    );

    return <div className="race-table-cell name">{content}</div>;
  }
}

const mapStateToProps = (state: any) => ({
  isAdmin: state.race.isAdmin,
  isManager: state.race.isManager,
});

export default connect(mapStateToProps)(RobotName);

const RobotNameUser: FunctionComponent<RobotSerialProps> = props => {
  const { robot } = props;
  return (
    <div className="robot-name">
      <div>{robot.name}</div>
    </div>
  );
};

class RobotNameAdmin extends PureComponent<any> {
  removeRobot = () => {
    if (confirm('Do you whant delete this robot => ' + this.props.robot.name+ ' : ' + this.props.robot.serial )) {
      this.props.sendMessage({
        serial: this.props.robot.serial,
        type: "ROBOT_REMOVE"
      });
    }
  };

  addLap = () => {
    this.props.sendMessage({
      serial: this.props.robot.serial,
      type: "LAP_MAN",
      laps: 1
    });
  };

  removeLap = () => {
    this.props.sendMessage({
      serial: this.props.robot.serial,
      type: "LAP_MAN",
      laps: -1
    });
  };

  pitstop = () => {
    this.props.sendMessage({
      serial: this.props.robot.serial,
      type: "PIT_STOP"
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.sendMessage({
          name: values.name,
          serial: this.props.robot.serial,
          type: "ROBOT_EDIT"
        });
      }
    });
  };

  public render() {
    const { getFieldsError } = this.props.form;
    
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <InputWrapper
            form={this.props.form}
            id="name"
            type="name"
            iconType="copy"
            rules={[
              {
                required: true,
                message: "Please enter name"
              }
            ]}
          />
          {this.props.isManager == true &&
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                save
              </Button>
            </Form.Item>
          }
        </Form>
        <Form layout="inline">
          {this.props.isManager == true && 
            <Form.Item>
              <Button type="danger" onClick={this.removeRobot}>
                remove
              </Button>
            </Form.Item>
          }
          <Form.Item>
            <Button type="primary" onClick={this.addLap} size="large">
              +&nbsp;1
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.removeLap} size="large">
              -&nbsp;1
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.pitstop} size="large">
              pit stop
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps: any = {
  sendMessage
};

const RobotNameAdminForm = connect<any>(
  null,
  mapDispatchToProps
)(
  Form.create<any>({
    name: "edit_name",
    mapPropsToFields(props) {
      return {
        name: Form.createFormField({
          ...props.name,
          value: props.robot.name
        })
      };
    }
  })(RobotNameAdmin)
);
