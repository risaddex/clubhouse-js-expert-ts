import { Socket } from "socket.io"
import { RoomData, socketEvents } from "../../../global"
import { BaseController } from "../../types"
import Event from 'events'

import debug from 'debug'
import Room from "../entities/room"

const log = debug('server:lobbyController')

type BaseControllerOptions = {
  activeRooms?: Map<string, Room>
  roomsListener: Event
}

export default class LobbyController implements BaseController {
  activeRooms?:Map<string, Room>
  roomsListener: Event

  constructor({activeRooms, roomsListener}:BaseControllerOptions){
    this.activeRooms = activeRooms
    this.roomsListener = roomsListener
  }
  
  onNewConnection(socket: Socket) {
    const {id} = socket
    log(`connection established with ${id}`)
    this.#updateLobbyRooms(socket, [...this.activeRooms.values()])
  }
  
  getEvents(): Map<string, Function> {
    const functions = Reflect.ownKeys(LobbyController.prototype)
      .filter((fn) => fn !== 'constructor')
      .map((name) => [name, this[name].bind(this)])

    return new Map(functions as any)
  }
  joinRoom(socket: Socket, { user, room }: RoomData): void {
    // throw new Error("Method not implemented.")
  }
  disconnect(socket: Socket): void {
    // throw new Error("Method not implemented.")
  }

  // @ts-expect-error
  #updateLobbyRooms(socket:Socket, activeRooms:Room[]) {
    socket.emit(socketEvents.LOBBY_UPDATED, activeRooms)
  }

  
}