import { ListenerCallback, socketEvents } from '../../../../global'

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
    const socketOptions: Partial<io.ManagerOptions> = {
      withCredentials: false,
      
    }
    const socket = globalThis.io.connect(this.socketUrl, socketOptions)

    socket.on('connect', () =>
      console.log(`Você está conectado na sala ${socket.id}.`)
    )

    socket.on(socketEvents.USER_CONNECTED, this.onUserConnected)
    socket.on(socketEvents.USER_DISCONNECTED, this.onUserDisconnected)

    return socket
  }
}
