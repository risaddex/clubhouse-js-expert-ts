import { BaseAttendee } from "../../../global"

export default class Attendee implements BaseAttendee {
    id: string
    isSpeaker: boolean
    roomId: string
    img: string
    username: string 
    peerId?: string

  constructor({ id, img, isSpeaker, roomId, username, peerId }: BaseAttendee) {
    this.id = id
    this.img = img
    this.isSpeaker = isSpeaker
    this.roomId = roomId
    this.username = username
    this.peerId = peerId
  }
}
