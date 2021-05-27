import { MediaConnection } from 'peerjs'
import Media from '../../_shared/media.js'
import { CustomPeerModule } from '../../_shared/peerBuilder.js'
import Attendee from './entities/attendee.js'
import UserStream from './entities/userStream.js'

type RoomServiceArgs = {
  media: typeof Media
}
export default class RoomService {
  currentPeer: CustomPeerModule
  currentUser: Attendee
  media: typeof Media
  currentStream: UserStream
  peers: Map<string, { call: MediaConnection }>

  constructor({ media }: RoomServiceArgs) {
    this.media = media
    this.currentPeer = {} as CustomPeerModule
    this.currentUser = {} as Attendee
    this.currentStream = {} as UserStream

    this.peers = new Map()
  }

  async initialize() {
    this.currentStream = new UserStream({
      stream: await this.media.getUserAudio(),
      isFake: false,
    })

  }

  setCurrentPeer(peer: CustomPeerModule) {
    this.currentPeer = peer
  }

  getCurrentUser() {
    return this.currentUser
  }

  upgradeUserPermission(user: Attendee) {
    if (!user.isSpeaker) {
      return;
    }
    //trata reconexões/dirty states
    const isCurrentUser = user.id === this.currentUser.id

    if (!isCurrentUser) {
      return;
    }

    this.currentUser = user
  }

  updateCurrentUserProfile(users: Attendee[]) {
    this.currentUser = users.find(
      ({ peerId }) => peerId === this.currentPeer.id
    )
  }

  async getCurrentStream() {
    const { isSpeaker } = this.currentUser

    if (isSpeaker) {
      return this.currentStream.stream
    }

    return this.media.createMediaStreamFake()
  }

  addReceivedPeer(call: MediaConnection) {
    const calledId = call.peer
    this.peers.set(calledId, { call })

    const isCurrentId = calledId === this.currentUser.id

    return { isCurrentId }
  }

  disconnectPeer({peerId}:{peerId:string}) {
    if(!this.peers.has(peerId)) {
      return;
    }

    this.peers.get(peerId).call.close()
    this.peers.delete(peerId)
  }
 
  async callNewUser(user: Attendee) {
    const {isSpeaker} = this.currentUser
    // se o usuário for speaker, ele vai me ligar
    if (!isSpeaker) return;

    const stream = await this.getCurrentStream()
    this.currentPeer.call(user.peerId, stream)
  }

  
}
