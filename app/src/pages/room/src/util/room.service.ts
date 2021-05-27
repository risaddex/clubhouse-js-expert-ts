import Peer from 'peerjs'
import Media from '../../../_shared/media.js'
import Attendee from '../entities/attendee.js'
import UserStream from '../entities/userStream.js'

type RoomServiceArgs = {
  media: typeof Media
}
export default class RoomService {
  currentPeer: Peer
  currentUser: Attendee
  media:typeof Media
  currentStream: UserStream

  constructor({media}:RoomServiceArgs) {
    this.media = media

    this.currentPeer = {} as Peer
    this.currentUser  = {} as Attendee
    this.currentStream = {} as UserStream
  }

  public async initialize() {
    await this.media.getUserAudio()
  }

  public setCurrentPeer(peer: Peer) {
    this.currentPeer = peer
  }

  public getCurrentUser() {
    return this.currentUser
  }

  public upgradeUserPermission(user:Attendee) {
    if (!user.isSpeaker) return;
    //trata reconexões/dirty states
    const isCurrentUser = user.id === this.currentUser.id
    if(!isCurrentUser) return;
    this.currentUser = user
  }

  public updateCurrentUserProfile(users: Attendee[]) {
    this.currentUser = users.find(
      ({ peerId }) => peerId === this.currentPeer.id
    )
  }
}
