import { ListenerCallback, SocketBuilderOptions, socketEvents } from '../../../../../global'
import SocketBuilder from '../../../_shared/socketBuilder.js'

export default class RoomSocketBuilder extends SocketBuilder {
  onRoomUpdated: ListenerCallback
  
  constructor({ socketUrl, namespace }:SocketBuilderOptions) {
    super({ socketUrl, namespace })
    this.onRoomUpdated = () => {}
  }

  setOnRoomUpdated(fn: ListenerCallback) {
    this.onRoomUpdated = fn

    return this
  }

  build() {
    const socket = super.build()

    socket.on(socketEvents.LOBBY_UPDATED, this.onRoomUpdated)
    return socket
  }
}
