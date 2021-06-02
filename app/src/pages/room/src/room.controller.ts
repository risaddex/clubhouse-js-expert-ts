import { MediaConnection } from 'peerjs'
import { Socket } from 'socket.io-client'
import {
  ListenerCallback,
  RoomData,
  socketEvents
} from '../../../../../global'
import PeerBuilder, { CustomPeerModule } from '../../_shared/peerBuilder.js'
import Attendee from './entities/attendee.js'
import RoomService from './room.service.js'
import View from './room.view.js'
import RoomSocketBuilder from './util/roomSocketBuilder.js'


export type InitializeDeps = {
  view: typeof View
  socketBuilder: RoomSocketBuilder
  roomInfo: RoomData
  peerBuilder: PeerBuilder
  roomService: RoomService
}

export default class RoomController {
  socket= {} as Socket
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
    return new RoomController(deps)._initialize()
  }

  private async _initialize() {
    this.setupViewEvents()
    this.roomService.initialize()
    
    this.socket = this.setupSocket()
    this.roomService.setCurrentPeer(await this.setupWebRTC())
  }

  private setupViewEvents() {
    this.view.configureOnMicrophoneActivatedButton(this.onMicrophoneActivatedButton())
    this.view.configureLeaveButton()
    this.view.configureClapButton(this.onClapPressed())
    this.view.updateUserImage(this.roomInfo.user)
    this.view.updateRoomTopic(this.roomInfo.room.topic)
  }

  private onMicrophoneActivatedButton(): ListenerCallback {
    return async () => {
      await this.roomService.toggleAudioActivation()
     }
  }

  private onClapPressed(): ListenerCallback {
    return () => {
      this.socket.emit(socketEvents.SPEAK_REQUEST, this.roomInfo.user)
    }
  }

  private setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .setOnSpeakRequested(this.onSpeakRequested())
      .build()
  }

  private onSpeakRequested(): ListenerCallback {
    return (data:Attendee) => { 
      const user = new Attendee(data)
      const result = prompt(`${user.username} pediu para falar! 1 sim, 0 não`)
      this.socket.emit(socketEvents.SPEAK_ANSWER, {answer: !!Number(result), user})
    }
  }

  private async setupWebRTC() {
    return this.peerBuilder 
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build()
  }

  private onStreamReceived(): ListenerCallback {
    return (call:MediaConnection, stream:MediaStream) => { 
      console.log('onStreamReceived', call, stream)
      // console.warn('áudio desabilitado (linha 86)')
      const {isCurrentId} = this.roomService.addReceivedPeer(call)

      this.view.renderAudioElement({
        stream,
        isCurrentId
      })
    }
  }

  private onCallClose(): ListenerCallback {
    return (call:MediaConnection) => {
      console.log('onCallClose', call)
      const peerId = call.peer
      this.roomService.disconnectPeer({peerId})
     }
  }

  private onCallError(): ListenerCallback {
    return (call:MediaConnection, error) => {
      console.log('onCallError', call, error)
      const peerId = call.peer
      this.roomService.disconnectPeer({peerId})
     }
  }

  private onCallReceived(): ListenerCallback {
    return async  (call: MediaConnection) => {
      const stream = await this.roomService.getCurrentStream()
      console.log('answering call', call)
      call.answer(stream)
     }
  }

  private onPeerError(): ListenerCallback {
    return (error) => {
      console.error('error:', error)
     }
  }

  // quando a conexão for aberta, ele pede para entrar na sala
  private onPeerConnectionOpened(): ListenerCallback {
    return (peer:CustomPeerModule) => {
      console.log('peer:', peer)
      this.roomInfo.user.peerId = peer.id
      this.socket.emit(socketEvents.JOIN_ROOM, this.roomInfo)
    }
  }

  private onUserProfileUpgrade(): ListenerCallback {
    return (attendee: Attendee) => {
      const user = new Attendee(attendee)

      console.log('onUserProfileUpgrade', user)
      
      if (user.isSpeaker) {
        this.roomService.upgradeUserPermission(user)
        this.view._addAttendeeOnGrid(user, true)
      }

      this.activateUserFeatures()
    }
  }

  private onRoomUpdated(): ListenerCallback {
    return (roomList: Attendee[]) => {
      const users = roomList.map(user => new Attendee(user))
      console.log('room list:', users)

      this.view.updateAttendeesOnGrid(users)
      this.roomService.updateCurrentUserProfile(users)
      this.activateUserFeatures()
    }
  }

  private onUserDisconnected(): ListenerCallback {
    return (attendee: Attendee) => {
      const user = new Attendee(attendee)

      console.log(`${user.username} disconnected`)

      this.view.removeItemFromGrid(user.id)
      
      this.roomService.disconnectPeer(user)
    }
  }

  private onUserConnected(): ListenerCallback {
    return (attendee: Attendee) => {
      const user = new Attendee(attendee)
      console.log('user connected!', user)

      this.view._addAttendeeOnGrid(user)
      this.roomService.callNewUser(user)
    }
  }

  private activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser()
    this.view.showUserFeatures(currentUser.isSpeaker)
  }
}
