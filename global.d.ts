import EventEmitter from 'events'
import Event from 'events'

declare const enum constants {
  SOCKET_URL = 'http://localhost:3000',
}

declare const enum socketEvents {
  USER_CONNECTED = 'userConnection',
  USER_DISCONNECTED = 'userDisconnection',
  JOIN_ROOM = 'joinRoom',
  LOBBY_UPDATED = 'lobbyUpdated',
}

declare const enum socketNamespaces {
  room = 'room',
  lobby = 'lobby',
}

declare type SocketBuilderOptions = {
  socketUrl: string
  namespace: string
}

declare type EventMap = {
  eventName: string
  eventEmitter: Function
}

declare type RoomData = {
  room: TRoom
  user: TUser
}

declare type TRoom = {
  id: string
  topic: string
}

declare type TUser = {
  id: string
  img: string
  username: string
}

declare interface IAttendee extends TUser {
  isSpeaker: boolean
  roomId: string
  peerId?: string
}

declare type ListenerCallback = (...args: any[]) => void

declare type RouteConfig = {
  room: {
    events: Map<string, Function>
    eventEmitter: Event
  }
}