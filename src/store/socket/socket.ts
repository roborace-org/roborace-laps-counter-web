class Socket {
  private socket!: WebSocket;

  connect = (wsURL: string): WebSocket => {
    this.socket = new WebSocket(wsURL);
    return this.socket;
  };

  disconnect = () => {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  };

  send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    this.socket.send(data);
  };
}

const socket = new Socket();

export default socket;
