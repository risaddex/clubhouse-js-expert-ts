/**
 * GLOBAL ENVIRONMENT TYPES/CONSTANTS
 */

import Event from 'events'

declare global {
  export namespace constants {
    const enum URLS {
      STORAGE_KEY = 'jsexpert:storage:user',
      SOCKET_URL = 'jsexpert-socket-server.herokuapp.com',
    }
    const enum socketEvents {
      USER_CONNECTED = 'userConnection',
      USER_DISCONNECTED = 'userDisconnection',
      JOIN_ROOM = 'joinRoom',
      LOBBY_UPDATED = 'lobbyUpdated',
      UPGRADE_USER_PERMISSION = 'upgradeUserPermission',
      SPEAK_REQUEST = 'speakRequest',
      SPEAK_ANSWER = 'speakAnswer',
    }

    const enum pages {
      lobby = '/pages/lobby',
      login = '/pages/login',
    }

    const enum socketNamespaces {
      room = 'room',
      lobby = 'lobby',
    }
  }

  type SocketBuilderOptions = {
    socketUrl: string
    namespace: string
  }

  type EventMap = {
    eventName: string
    eventEmitter: Function
  }

  type TRoom = {
    id: string
    topic: string
  }

  type TUser = {
    id?: string
    img: string
    username: string
  }

  type RoomData = {
    room: IRoom
    user?: IAttendee
  }

  type ListenerCallback = (...args: any[]) => void

  interface RouteConfig {
    room?: {
      events: Map<string, () => void>
      eventEmitter: Event
    }
  }

  type IRoom = {
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

  type IAttendee = {
    id?: string
    isSpeaker?: boolean
    roomId?: string
    img: string
    username: string
    peerId?: string
  }
}
