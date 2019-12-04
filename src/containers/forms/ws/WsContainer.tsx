import React, { Component } from "react";

import WsForm from "./WsForm";

export interface IAppProps {
  connectFromSubmit: (wsURL: string) => void;
}

export default class WsContainer extends Component<IAppProps, any> {
  render() {
    return (
      <WsForm
        onSubmit={(wsFormData: any) =>
          this.props.connectFromSubmit(wsFormData.wsUrl as string)
        }
      ></WsForm>
    );
  }
}
