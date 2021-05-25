// Essa classe mapeia os eventos que ocorrem na sala
import debug from 'debug'
import { Socket } from 'socket.io'
import {
  RoomData,
  socketEvents,

  TRoom,
  TUser
} from '../../../global'
import Attendee from '../entities/attendee.js'
import Room from '../entities/room.js'
const log = debug('server:roomsController')

export default class RoomsController {
  #users: Map<string, Attendee> = new Map()
  rooms: Map<string, Room>

  constructor() {
    this.rooms = new Map()
  }

  onNewConnection(socket: Socket) {
    const { id } = socket
    log(`connection established with ${id}`)
    this.#updateGlobalUserData(id)
  }

  joinRoom(socket: Socket, { user, room }: RoomData) {

    const userId = (user.id = socket.id)
    const roomId = room.id

    const updatedUserData = this.#updateGlobalUserData(userId, user, roomId)

    log({ updatedUserData })

    const updatedRoom = this.#joinUserRoom(socket, updatedUserData, room)
    
    this.#notifyUsersOnRoom(socket, roomId, updatedUserData)
    this.#replyWithActiveUsers(socket, updatedRoom.users)

  }
  //@ts-expect-error
  #replyWithActiveUsers(socket:Socket, users:Set<Attendee>) {
    const event = socketEvents.LOBBY_UPDATED
    socket.emit(event, [...users.values()])
  }
  //@ts-expect-error
  #notifyUsersOnRoom(socket:Socket, roomId:string, user: Attendee) {
    const event = socketEvents.USER_CONNECTED
    
    socket.to(roomId).emit(event,user)
  }
  //@ts-expect-error
  #joinUserRoom(socket: Socket, user: Attendee, room: TRoom) {
    const roomId = room.id
    const existingRoom = this.rooms.has(roomId)
    const currentRoom = existingRoom ? this.rooms.get(roomId) : {} as Room
    const currentUser = new Attendee({
      ...user,
      roomId,
    })

    // definir quem é o dono da sala 

    const [owner, users]:[Attendee, Set<Attendee>] = existingRoom ? 
      [currentRoom.owner, currentRoom.users] :
      [currentUser, new Set()]

      const updatedRoom = this.#mapRoom({
        ...currentRoom,
        ...room,
        owner,
        users: new Set([...users, ...[currentUser]])
      })

      this.rooms.set(roomId, updatedRoom)

      socket.join(roomId)

      return this.rooms.get(roomId)
  }
  //@ts-expect-error
  #mapRoom(room:Room) {
    const users = [...room.users.values()]
    const speakersCount = users.filter(user => user.isSpeaker).length
    const featuredAttendees = users.slice(0,3)
    const mappedRoom = new Room({
      ...room,
      featuredAttendees,
      speakersCount,
      attendeesCount:room.users.size
    })

    return mappedRoom
  }

  //@ts-expect-error
  #updateGlobalUserData(userId: string, userData?: TUser, roomId?: string) {
    const user = this.#users.get(userId) ?? {}
    const existingRoom = this.rooms.has(roomId)

    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // se for o único, se torna o speaker
      isSpeaker: !existingRoom,
    })

    this.#users.set(userId, updatedUserData)
    return this.#users.get(userId)
  }

  getEvents() {
    //navegar entre a estrutura para pegar as funções publicas

    //captura o nome das funções publicas
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fn) => fn !== 'constructor')
      .map((name) => [name, this[name].bind(this)])

    return new Map(functions as [string, Function][])

    /**
     * [
     *    ['onNewConnection', this.onNewConnection] ,
     *    ['disconnect', this.disconnect],
     * ]
     *
     */
  }
}
