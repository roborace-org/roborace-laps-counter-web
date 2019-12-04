import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Icon, Button } from "antd";
import { withRouter } from "react-router-dom";

import { InputWrapper } from "../../../components/common/input-wrapper/InputWrapper";
import { hashCode } from "../../../utils";
import { setIsAdmin } from "../../../store/race/actions";

export interface IAppProps {}

class LoginForm extends Component<any, any> {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setIsAdmin(true);
        this.props.history.push("/");
      }
    });
  };

  public render() {
    const validator = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      const truePassword = "-544719056";
      if ("" + hashCode(value) !== truePassword) {
        callback("Wrong password");
      }

      return true;
    };
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <InputWrapper
          form={this.props.form}
          id="password"
          type="password"
          iconType="lock"
          rules={[
            {
              required: true,
              message: "Please input your password!"
            },
            {
              validator
            }
          ]}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapDispatchToProps = {
  setIsAdmin
};
export default Form.create({ name: "login_form" })(
  connect(null, mapDispatchToProps)(withRouter(LoginForm))
);
