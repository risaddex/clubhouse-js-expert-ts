import { MediaConnection } from 'peerjs'
import Media from '../../_shared/media.js'
import { CustomPeerModule } from '../../_shared/peerBuilder.js'
import Attendee from './entities/attendee.js'
import UserStream from './entities/userStream.js'

type RoomServiceArgs = {
  media: typeof Media
}
export default class RoomService {
  currentPeer = {} as CustomPeerModule
  currentUser = {} as Attendee
  isAudioActive = true
  media: typeof Media
  currentStream = {} as UserStream
  peers = new Map<string, { call: MediaConnection }>()

  constructor({ media }: RoomServiceArgs) {
    this.media = media
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

  async toggleAudioActivation() {
    this.isAudioActive = !this.isAudioActive
    this.switchAudioStreamSource({isRealAudio: this.isAudioActive})
  }

  upgradeUserPermission(user: Attendee) {
    if (!user.isSpeaker) {
      return
    }
    //trata reconexões/dirty states
    const isCurrentUser = user.id === this.currentUser.id

    if (!isCurrentUser) {
      return
    }

    this.currentUser = user

    return this.reconnectAsSpeaker()
  }

  private async reconnectAsSpeaker() {
    return this.switchAudioStreamSource({ isRealAudio: true })
  }

  private reconnectPeers(stream: MediaStream) {
    for (const peer of this.peers.values()) {
      const peerId = peer.call.peer
      peer.call.close()
      console.log(`calling ${peerId}`)

      this.currentPeer.call(peerId, stream)
    }
  }

  async switchAudioStreamSource({ isRealAudio }: { isRealAudio: boolean }) {
    const userAudio = isRealAudio
      ? await this.media.getUserAudio()
      : this.media.createMediaStreamFake()

    this.currentStream = new UserStream({
      isFake: isRealAudio,
      stream: userAudio,
    })

    this.currentUser.isSpeaker = isRealAudio
    // finish current calls to make a recall
    this.reconnectPeers(this.currentStream.stream)
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

  disconnectPeer({ peerId }: { peerId?: string }) {
    if (!this.peers.has(peerId)) {
      return
    }

    this.peers.get(peerId).call.close()
    this.peers.delete(peerId)
  }

  async callNewUser(user: Attendee) {
    const { isSpeaker } = this.currentUser
    // se o usuário for speaker, ele vai me ligar
    if (!isSpeaker) return

    const stream = await this.getCurrentStream()
    this.currentPeer.call(user.peerId, stream)
  }
}
