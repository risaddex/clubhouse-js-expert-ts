import { Socket } from 'socket.io-client'
import UserDb from '../../_shared/userDb.js'
import Room from './entities/room.js'
import View from './lobby.view.js'
import LobbySocketBuilder from './lobbySocketBuilder.js'

type LobbyControllerDeps = {
  user: IAttendee
  socketBuilder: LobbySocketBuilder
  socket?:Socket
  view: typeof View
}

export default class LobbyController {
  user: IAttendee
  socketBuilder: LobbySocketBuilder
  socket: Socket
  view:typeof View

  constructor({ socketBuilder, user, view }: LobbyControllerDeps) {
    this.socketBuilder = socketBuilder
    this.user = user
    this.socket = {} as Socket
    this.view = view
  }

  static async initialize(deps: LobbyControllerDeps) {
    return new LobbyController(deps).init()
  }

  private async init() {
    this.setupViewEvents()
    this.socket = this.setupSocket()
  }

  private setupSocket() {
    return this.socketBuilder
    .setOnLobbyUpdated(this.onLobbyUpdated())
    .build()
  }

  private setupViewEvents() {
    this.view.updateUserImage(this.user)
    this.view.configureCreateRoomButton()
  }

  private onLobbyUpdated(): ListenerCallback{
    return (rooms:Room[]) => {
      this.view.updateRoomList(rooms)
      console.log('rooms', rooms)
    }
  }

}
