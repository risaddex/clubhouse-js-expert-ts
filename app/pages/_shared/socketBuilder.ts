//Builder design pattern
export default class SocketBuilder {
  //  private readonly socketUrl: string;
  //  private readonly namespace: string
  //  private onUserConnected() {}
  //  private onUserDisconnected() {}

  constructor({socketUrl, namespace}) {
    this.socketUrl = `${socketUrl}/${namespace}`
    this.onUserConnected = () => {}
    this.onUserDisconnected = () => {}
  }

  setOnUserConnected(fn) {
    this.onUserConnected = fn

    return this
  }

  setOnUserDisconnected(fn) {
    this.onUserDisconnected = fn

    return this
  }

  build() {

    const socket = globalThis.io.connect((this.socketUrl, {
      withCredentials: false,
      
    }))

    

    socket.on('connection', () => console.log('conectado'))

    socket.on(socketEvents.USER_CONNECTED, this.onUserConnected)
    socket.on(socketEvents.USER_DISCONNECTED, this.onUserDisconnected)

    return socket
  }
}