import PeerJS from 'peerjs';
import {
  ManagerOptions as Mng,
  Socket as IO,
  SocketOptions as Opt,
} from 'socket.io-client'

declare global {
  module globalThis {
     module io {
      export class Socket extends IO {}
      export interface SocketOptions extends Opt {}
      export interface ManagerOptions extends Mng{}
      function connect(uri: string, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
    }

    export interface Peer extends PeerJS {}
  }
}
