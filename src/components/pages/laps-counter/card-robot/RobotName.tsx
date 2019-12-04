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
}
class RobotName extends PureComponent<RobotSerialProps, any> {
  public render() {
    const { robot, isAdmin } = this.props as any;

    const content = isAdmin ? (
      <RobotNameAdminForm robot={robot} />
    ) : (
      <RobotNameUser robot={robot} />
    );

    return <div className="race-table-cell name">{content}</div>;
  }
}

const mapStateToProps = (state: any) => ({
  isAdmin: state.race.isAdmin
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
    this.props.sendMessage({
      serial: this.props.robot.serial,
      type: "ROBOT_REMOVE"
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              save
            </Button>
          </Form.Item>
        </Form>
        <Button type="danger" onClick={this.removeRobot}>
          remove
        </Button>
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
