import Peer from 'peerjs'
import { Socket } from 'socket.io-client'
import {
  ListenerCallback,
  RoomData,
  socketEvents
} from '../../../../../../global'
import PeerBuilder from '../../../_shared/peerBuilder.js'
import Attendee from '../entities/attendee.js'
import RoomService from './room.service.js'
import View from './room.view.js'
import RoomSocketBuilder from './roomSocketBuilder.js'


export type InitializeDeps = {
  view: typeof View
  socketBuilder: RoomSocketBuilder
  roomInfo: RoomData
  peerBuilder: PeerBuilder
  roomService: RoomService
}

export default class RoomController {
  socket: Socket
  peer: Peer
  roomInfo: RoomData
  peerBuilder: PeerBuilder
  roomService: RoomService
  socketBuilder: RoomSocketBuilder
  view: typeof View

  constructor({ roomInfo, socketBuilder, view, peerBuilder, roomService }: InitializeDeps) {
    this.roomInfo = roomInfo
    this.socketBuilder = socketBuilder
    this.peerBuilder = peerBuilder
    this.roomService = roomService
    this.view = view
  }

  static async initialize(deps: InitializeDeps) {
    return new RoomController(deps).initialize()
  }

  private async initialize() {
    this.setupViewEvents()
    this.roomService.initialize()
    
    this.socket = this.setupSocket()
    this.roomService.setCurrentPeer(await this.setupWebRTC())
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

  private async setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .build()
  }

  private onPeerError(): ListenerCallback {
    return error => {
      console.log('error:', error)
     }
  }

  // quando a conexão for aberta, ele pede para entrar na sala
  private onPeerConnectionOpened(): ListenerCallback {
    return (peer:Peer) => { 
      console.log('peeer:', peer)
      this.roomInfo.user.peerId = peer.id
      this.socket.emit(socketEvents.JOIN_ROOM, this.roomInfo)
    }
  }

  private onUserProfileUpgrade(): ListenerCallback {
    return (attendee: Attendee) => {
      const user = new Attendee(attendee)

      this.roomService.upgradeUserPermission(user)
      console.log('onUserProfileUpgrade', user)

      if (user.isSpeaker) {
        this.view.addAttendeeOnGrid(user, true)
      }

      this.activateUserFeatures()
    }
  }

  private onRoomUpdated(): ListenerCallback {
    return (roomList: Attendee[]) => {
      console.log('room list:', roomList)

      const users = roomList.map(user => new Attendee(user))
      this.roomService.updateCurrentUserProfile(users)
      this.view.updateAttendeesOnGrid(users)
      this.activateUserFeatures()
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

  private activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser()
    this.view.showUserFeatures(currentUser.isSpeaker)
  }
}
