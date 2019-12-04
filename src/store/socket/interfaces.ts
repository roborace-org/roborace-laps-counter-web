export enum SocketStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
}

export interface ISocketState {
  status?: SocketStatus,
  isError?: boolean,
  wsURL?: string,
}