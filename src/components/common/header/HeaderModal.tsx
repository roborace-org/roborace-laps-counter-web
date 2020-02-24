import * as React from "react";
import { Modal, Button } from "antd";
import { connect } from "react-redux";

import WsContainer from "../../../containers/forms/ws/WsContainer";
import { submitWS } from "../../../store/initData/actions";
import { SocketStatus, ISocketState } from "../../../store/socket/interfaces";
import { connectSocket, disconnectSocket } from "../../../store/socket/actions";

export interface IAppProps extends IStateToProps, IDispatchToProps {
  visible: boolean;
  toggleModal: (visible: boolean) => void;
}

export interface IAppState {}

class HeaderModal extends React.Component<IAppProps, IAppState> {
  private onConnectButtonClick = () => {
    this.props.submitWS();
  };

  private onDisconnectButtonClick = () => {
    this.props.disconnectSocket();
  };

  private closeModal = () => {
    this.props.toggleModal(false);
  };

  private connectFromSubmit = (wsURL: string) => {
    this.props.connectSocket(wsURL);
  };

  get isLoading() {
    return this.props.status === SocketStatus.Connecting;
  }

  get disconnectButton() {
    return (
      <Button
        key="submit"
        type="primary"
        loading={this.isLoading}
        onClick={() => this.onDisconnectButtonClick()}
      >
        Disconnect
      </Button>
    );
  }

  get connectButton() {
    return (
      <Button
        key="submit"
        type="primary"
        loading={this.isLoading}
        onClick={() => this.onConnectButtonClick()}
      >
        Connect
      </Button>
    );
  }

  componentDidMount() {
    this.props.connectSocket("ws://laps.roborace.org:8888/ws");
  }
  public render() {
    return (
      <Modal
        title="Connecting"
        visible={this.props.visible}
        onCancel={this.closeModal}
        footer={[
          <Button key="back" onClick={this.closeModal}>
            Close
          </Button>,
          this.props.status === SocketStatus.Connected
            ? this.disconnectButton
            : this.connectButton
        ]}
      >
        <WsContainer connectFromSubmit={this.connectFromSubmit} />
      </Modal>
    );
  }
}

interface IStateToProps extends ISocketState {}

interface IMapStateToProps {
  (state: any): IStateToProps;
}

const mapStateToProps: IMapStateToProps = (state: any) => ({
  ...state.socketState
});

interface IDispatchToProps {
  connectSocket: (wsURL: string) => void;
  disconnectSocket: () => void;
  submitWS: () => void;
}
const mapDispatchToProps: IDispatchToProps = {
  connectSocket,
  disconnectSocket,
  submitWS
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderModal);
