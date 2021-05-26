import { ListenerCallback, SocketBuilderOptions, socketEvents } from '../../../../../../global'
import SocketBuilder from '../../../_shared/socketBuilder.js'

export default class RoomSocketBuilder extends SocketBuilder {
  onRoomUpdated: ListenerCallback
  onUserProfileUpgrade: ListenerCallback
  socketUrl: string
  namespace: string
  
  constructor({ socketUrl, namespace }:SocketBuilderOptions) {
    super({namespace, socketUrl} as SocketBuilder)
    this.onRoomUpdated = () => {}
    this.onUserProfileUpgrade = () => {}

  }

  setOnRoomUpdated(fn: ListenerCallback) {
    this.onRoomUpdated = fn
    return this 
  }

  setOnUserProfileUpgrade(fn: ListenerCallback) {
    this.onUserProfileUpgrade = fn
    return this
  }

  build() {
    const socket = super.build()

    socket.on(socketEvents.LOBBY_UPDATED, this.onRoomUpdated)
    socket.on(socketEvents.UPGRADE_USER_PERMISSION, this.onUserProfileUpgrade)
    return socket
  }
}
