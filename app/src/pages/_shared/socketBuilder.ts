
import { ManagerOptions, Socket } from 'socket.io-client'
//Builder design pattern
export default class SocketBuilder {
  onUserConnected: ListenerCallback
  onUserDisconnected: ListenerCallback
  socketUrl: string 
  namespace: string

  constructor({ socketUrl, namespace }: SocketBuilder) {
    this.socketUrl = `${socketUrl}/${namespace}`
    this.onUserConnected = () => {}
    this.onUserDisconnected = () => {}
  }

  setOnUserConnected(fn: ListenerCallback) {
    this.onUserConnected = fn

    return this
  }

  setOnUserDisconnected(fn: ListenerCallback) {
    this.onUserDisconnected = fn
    return this
  } 
  build() {
    const socketOptions: Partial<ManagerOptions> = {
      withCredentials: false,
      
    }
    const socket = globalThis.io.connect(this.socketUrl, socketOptions) as Socket
    socket.on('connect', () =>
      console.log(`Você está conectado na sala ${socket.id}.`)
    )

    socket.on(constants.socketEvents.USER_CONNECTED, this.onUserConnected)
    socket.on(constants.socketEvents.USER_DISCONNECTED, this.onUserDisconnected)

    return socket
  }
}
