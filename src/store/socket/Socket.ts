export default class Socket {
  private socket!: WebSocket;

  constructor() {}

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
