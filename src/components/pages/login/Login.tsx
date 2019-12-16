import React, { Component } from "react";

import "./Login.scss";
import LoginForm from "../../../containers/forms/login-form/LoginForm";

export interface IAppProps {}
export interface IAppState {}

export default class Login extends Component<IAppProps, IAppState> {
  public render() {
    return (
      <div className="login-page">
        <LoginForm />
      </div>
    );
  }
}
