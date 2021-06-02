import Event from 'events'




declare const enum constants {
  SOCKET_URL = 'localhost:3000',
  STORAGE_KEY = 'jsexpert:storage:user',
}

declare const enum socketEvents {
  USER_CONNECTED = 'userConnection',
  USER_DISCONNECTED = 'userDisconnection',
  JOIN_ROOM = 'joinRoom',
  LOBBY_UPDATED = 'lobbyUpdated',
  UPGRADE_USER_PERMISSION = 'upgradeUserPermission',

  SPEAK_REQUEST ='speakRequest',
  SPEAK_ANSWER = 'speakAnswer',
}

declare const enum pages {
  lobby = '/pages/lobby',
  login = '/pages/login',

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

declare type TRoom = {
  id: string
  topic: string
}

declare type TUser = {
  id?: string
  img: string
  username: string
}

declare type RoomData = {
  room: IRoom
  user?: IAttendee
}


declare type ListenerCallback = (...args: any[]) => void

declare interface RouteConfig {
  room?: {
    events: Map<string, () => void>
    eventEmitter: Event
  }
}

declare type IRoom = {
  id: string
  topic: string
  attendeesCount: number
  speakersCount: number
  featuredAttendees?: IAttendee[]
  owner: TUser
  users?: Set<TUser>
  subtopic?: string
  roomLink?: string

}

declare type IAttendee = {
  id?: string
  isSpeaker?: boolean
  roomId?: string
  img: string
  username: string
  peerId?: string

}
