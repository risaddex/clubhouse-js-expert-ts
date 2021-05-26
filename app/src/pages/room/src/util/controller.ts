import { Socket } from 'socket.io-client'
import {
  ListenerCallback,
  RoomData,
  socketEvents,
} from '../../../../../../global'
import Attendee from '../entities/attendee.js'
import RoomSocketBuilder from './roomSocket.js'
import View from './view.js'

export type InitializeDeps = {
  view: typeof View
  socketBuilder: RoomSocketBuilder
  roomInfo: RoomData
}

export default class RoomController {
  socket: Socket
  roomInfo: RoomData
  socketBuilder: RoomSocketBuilder
  view: typeof View

  constructor({ roomInfo, socketBuilder, view }: InitializeDeps) {
    this.roomInfo = roomInfo
    this.socketBuilder = socketBuilder
    this.view = view
  }

  static async initialize(deps: InitializeDeps) {
    return new RoomController(deps).initialize()
  }

  private async initialize() {
    this.setupViewEvents()

    this.socket = this.setupSocket()

    this.socket.emit(socketEvents.JOIN_ROOM, this.roomInfo)
  }

  private setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user)
    this.view.updateRoomTopic(this.roomInfo.room.topic)
  }

  private setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .build()
  }

  private onUserProfileUpgrade(): ListenerCallback {
    return (user: Attendee) => {
      console.log('onUserProfileUpgrade', user)
      if (user.isSpeaker) {
        this.view.addAttendeeOnGrid(user)
      }
    }
  }

  private onRoomUpdated(): ListenerCallback {
    return (roomList: Attendee[]) => {
      console.log('room list!', roomList)
      this.view.updateAttendeesOnGrid(roomList)
    }
  }

  private onUserDisconnected(): ListenerCallback {
    return (user: Attendee) => {
      console.log(`${user.username} disconnected`)
      this.view.removeItemFromGrid(user.id)
    }
  }

  private onUserConnected(): ListenerCallback {
    return (user: Attendee) => {
      console.log('user connected!', user)
      this.view.addAttendeeOnGrid(user)
    }
  }
}
