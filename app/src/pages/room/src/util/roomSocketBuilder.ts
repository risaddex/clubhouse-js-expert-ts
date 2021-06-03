
import SocketBuilder from '../../../_shared/socketBuilder.js'

export default class RoomSocketBuilder extends SocketBuilder {
  onRoomUpdated: ListenerCallback
  onSpeakRequested: ListenerCallback
  onUserProfileUpgrade: ListenerCallback
  socketUrl: string
  namespace: string

  constructor({ socketUrl, namespace }: SocketBuilderOptions) {
    super({ namespace, socketUrl } as SocketBuilder)
    this.onRoomUpdated = () => {}
    this.onUserProfileUpgrade = () => {}
    this.onSpeakRequested = () => {}
  }

  setOnRoomUpdated(fn: ListenerCallback) {
    this.onRoomUpdated = fn
    return this
  }

  setOnUserProfileUpgrade(fn: ListenerCallback) {
    this.onUserProfileUpgrade = fn
    return this
  }

  setOnSpeakRequested(fn: ListenerCallback) {
    this.onSpeakRequested = fn
    return this
  }

  build() {
    const socket = super.build()

    socket.on(constants.socketEvents.LOBBY_UPDATED, this.onRoomUpdated)
    socket.on(constants.socketEvents.UPGRADE_USER_PERMISSION, this.onUserProfileUpgrade)
    socket.on(constants.socketEvents.SPEAK_REQUEST, this.onSpeakRequested)
    return socket
  }
}
