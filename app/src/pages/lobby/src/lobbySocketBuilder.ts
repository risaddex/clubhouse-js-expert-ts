import { ListenerCallback, SocketBuilderOptions, socketEvents } from '../../../../../global'
import SocketBuilder from '../../_shared/socketBuilder.js'

export default class LobbySocketBuilder extends SocketBuilder {
  onLobbyUpdated: ListenerCallback
  socketUrl: string
  namespace: string
  
  constructor({ socketUrl, namespace }:SocketBuilderOptions) {
    super({namespace, socketUrl} as SocketBuilder)
    this.onLobbyUpdated = () => {}

  }

  setOnLobbyUpdated(fn: ListenerCallback) {
    this.onLobbyUpdated = fn
    return this 
  }



  build() {
    const socket = super.build()

    socket.on(socketEvents.LOBBY_UPDATED, this.onLobbyUpdated)

    return socket
  }
}
