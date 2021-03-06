// Essa classe mapeia os eventos que ocorrem na sala
import debug from 'debug'
import Event from 'events'
import { Socket } from 'socket.io'
import { IAttendee, ListenerCallback, socketEvents, TUser } from '../types'
import { BaseController } from '../types'
import Attendee from '../entities/attendee.js'
import Room from '../entities/room.js'
import CustomMap from '../util/customMap.js'
const log = debug('server:roomsController')

type RoomData = {
  room: Room
  user: Attendee
}

type RoomsControllerArgs = {
  roomsPubSub: Event
}
export default class RoomsController implements BaseController {
  #users: Map<string, Attendee> = new Map()
  rooms: Map<string, Room>
  roomsPubSub: Event

  constructor({ roomsPubSub }: RoomsControllerArgs) {
    this.roomsPubSub = roomsPubSub
    this.rooms = new CustomMap({
      observer: this.#roomObserver(),
      customMapper: this.#mapRoom.bind(this),
    })
  }
  // @ts-expect-error
  #roomObserver() {
    return {
      notify: (rooms: Room[]) => this.notifyRoomSubscribers(rooms),
    }
  }

  speakAnswer(
    socket: Socket,
    {
      answer,
      user,
    }: {
      answer: boolean
      user: Attendee
    }
  ) {
    const currentUser = this.#users.get(user.id) as Attendee
    const updatedUser = new Attendee({
      ...currentUser,
      isSpeaker: answer,
    })

    this.#users.set(user.id, updatedUser)

    const roomId = user.roomId
    const room = this.rooms.get(roomId) as Room
    const userOnRoom = [...room.users.values()].find(({ id }) => id === user.id) as Attendee

    room.users.delete(userOnRoom)
    room.users.add(updatedUser)
    // as we used the observer pattern on the custom Map, it will
    // automatically emit a event :)
    this.rooms.set(roomId, room)
    
    socket.emit(socketEvents.UPGRADE_USER_PERMISSION, updatedUser)
    // notify the whole room when the speaker permissions change
    this.#notifyUserProfileUpgrade(socket, roomId, updatedUser)
  }

  //envia um request par ao dono da sala
  speakRequest(socket: Socket) {
    const userId = socket.id
    const user = this.#users.get(userId) as Attendee
    const roomId = user.roomId
    const owner = this.rooms.get(roomId)?.owner  as Attendee

    socket.to(owner.id).emit(socketEvents.SPEAK_REQUEST, user)
  }

  notifyRoomSubscribers(rooms: Room[]) {
    const event = socketEvents.LOBBY_UPDATED
    this.roomsPubSub.emit(event, [...rooms.values()])
  }

  onNewConnection(socket: Socket) {
    const { id } = socket
    log(`connection established with ${id}`)
    this.#updateGlobalUserData(id)
  }

  disconnect(socket: Socket) {
    log('disconnected', socket.id)
    this.#logoutUser(socket)
  }

  /**
   * @see [Regra de Neg??cio](https://github.com/risaddex/clubhouse-js-expert-ts/blob/main/README.md#L41)
   * Disconnect a user from the room
   **/

  // @ts-expect-error
  #logoutUser(socket: Socket) {
    const userId = socket.id
    const user = this.#users?.get(userId) as IAttendee
    const roomId = user?.roomId as string
    // remover usu??rio da lista de usu??rios ativos
    this.#users?.delete(userId)

    // cleanup de usu??rios dirty
    if (!this.rooms?.has(roomId)) {
      return
    }

    const room = this.rooms?.get(roomId) as Room
    const toBeRemoved = [...room.users]?.find(({ id }) => id === userId) as Attendee
    // remove usu??rio da sala
    room.users?.delete(toBeRemoved)

    if (!room?.users.size) {
      this.rooms.delete(roomId)
      return
    }

    const disconnectedUserWasAOwner = userId === room.owner.id
    const onlyOneUserLeft = room.users.size === 1

    // se quem desconectou era o dono, passa a lideran??a
    if (onlyOneUserLeft || disconnectedUserWasAOwner) {
      room.owner = this.#getNewRoomOwner(room, socket)
    }

    // atualiza o set
    this.rooms.set(roomId, room)

    //notifica a sala enviando um evento ap??s o usu??rio ser removido
    socket.to(roomId).emit(socketEvents.USER_DISCONNECTED, user)
  }
  /**
   *
   * @see [Regra de Neg??cio](https://github.com/risaddex/clubhouse-js-expert-ts/blob/main/README.md#L47)
   * transfer room ownership when a user left
   */

  //@ts-expect-error
  #notifyUserProfileUpgrade(socket: Socket, roomId: string, user: Attendee) {
    socket.to(roomId).emit(socketEvents.UPGRADE_USER_PERMISSION, user)
  }
  //@ts-expect-error
  #getNewRoomOwner(room: Room, socket: Socket) {
    const users = [...room.users.values()]
    const activeSpeakers = users.find((user) => user.isSpeaker)

    // destruct para pegar o usu??rio mais antigo (1ra posi????o do array)
    const [newOwner] = activeSpeakers ? [activeSpeakers] : users
    newOwner.isSpeaker = true

    const outdatedUser = this.#users?.get(newOwner.id)
    const updatedUser = new Attendee({
      ...outdatedUser,
      ...newOwner,
    })

    this.#users?.set(newOwner.id, updatedUser)

    this.#notifyUserProfileUpgrade(socket, room.id, newOwner)

    return newOwner
  }

  joinRoom(socket: Socket, { user, room }: RoomData) {
    const userId = (user.id = socket.id)
    const roomId = room.id

    const updatedUserData = this.#updateGlobalUserData(userId, user, roomId) as Attendee

    log({ updatedUserData })

    const updatedRoom = <Room>this.#joinUserRoom(socket, updatedUserData, room)

    this.#notifyUsersOnRoom(socket, roomId, updatedUserData)
    this.#replyWithActiveUsers(socket, updatedRoom.users)
  }
  //@ts-expect-error
  #replyWithActiveUsers(socket: Socket, users: Set<Attendee>) {
    const event = socketEvents.LOBBY_UPDATED
    socket.emit(event, [...users.values()])
  }
  //@ts-expect-error
  #notifyUsersOnRoom(socket: Socket, roomId: string, user: Attendee) {
    const event = socketEvents.USER_CONNECTED

    socket.to(roomId).emit(event, user)
  }
  //@ts-expect-error
  #joinUserRoom(socket: Socket, user: Attendee, room: Room) {
    const roomId = room.id
    const existingRoom = this.rooms.has(roomId)
    const currentRoom = existingRoom ? this.rooms.get(roomId) as Room : ({} as Room) 
    const currentUser = new Attendee({
      ...user,
      roomId,
    })

    // definir quem ?? o dono da sala

    const [owner, users]: [Attendee, Set<Attendee>] = existingRoom
      ? [currentRoom.owner, currentRoom.users]
      : [currentUser, new Set()]

    const updatedRoom = this.#mapRoom({
      ...currentRoom,
      ...room,
      owner,
      users: new Set([...users, ...[currentUser]]),
    })

    this.rooms.set(roomId, updatedRoom)

    socket.join(roomId)

    return this.rooms.get(roomId)
  }
  //@ts-expect-error
  #mapRoom(room: Room) {
    const users = [...room.users.values()]
    const speakersCount = users.filter((user) => user.isSpeaker).length
    const featuredAttendees = users.slice(0, 3)
    const mappedRoom = new Room({
      ...room,
      featuredAttendees,
      speakersCount,
      attendeesCount: room.users.size,
    })

    return mappedRoom
  }

  //@ts-expect-error
  #updateGlobalUserData(userId: string, userData?: TUser, roomId?: string) {
    const user = this.#users.get(userId) ?? ({} as Attendee)
    const existingRoom = this.rooms.has(roomId)

    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // se for o ??nico, se torna o speaker
      isSpeaker: !existingRoom,
    })

    this.#users.set(userId, updatedUserData)
    return this.#users.get(userId)
  }

  getEvents(): Map<string, ListenerCallback> {
    //navegar entre a estrutura para pegar as fun????es publicas

    //captura o nome das fun????es publicas
    const functions = Reflect.ownKeys(RoomsController.prototype)
    .filter((fn ) => fn !== 'constructor')
      .map((name) => [name, this[name].bind(this)])

    return new Map(functions as any)
  }
}
