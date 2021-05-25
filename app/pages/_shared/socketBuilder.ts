import { Socket } from 'socket.io-client'
import { ListenerCallback, socketEvents } from '../../../global'

//Builder design pattern 
export type SocketBuilderArgs = {
  socketUrl: string
  namespace:string
}
export default class SocketBuilder {
  onUserConnected: ListenerCallback
  private onUserDisconnected: ListenerCallback
  private readonly socketUrl: string

  constructor({socketUrl, namespace}:SocketBuilderArgs) {
    this.socketUrl = `${socketUrl}/${namespace}`
    this.onUserConnected = () => {}
    this.onUserDisconnected = () => {}
  }

  setOnUserConnected(fn:ListenerCallback) {
    this.onUserConnected = fn

    return this
  }

  setOnUserDisconnected(fn:ListenerCallback) {
    this.onUserDisconnected = fn

    return this
  }

  build() {
    const socket = globalThis.io.connect(this.socketUrl, {
      withCredentials: false,
    }) as Socket

    socket.on('connection', () => console.log('conectado'))

    socket.on(socketEvents.USER_CONNECTED, this.onUserConnected)
    socket.on(socketEvents.USER_DISCONNECTED, this.onUserDisconnected)

    return socket
  }
}
