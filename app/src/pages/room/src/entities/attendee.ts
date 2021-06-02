import { IAttendee } from '../../../../../../global'

type AttendeeOptions = {
  isSpeaker: boolean
  roomId?: string
  peerId?: string
  id?: string
  img: string
  username: string
}
export default class Attendee implements IAttendee {
  isSpeaker: boolean
  roomId?: string
  peerId?: string
  id?: string
  img: string
  username: string
  lastName?: string
  firstName?: string

  constructor({
    id,
    isSpeaker,
    peerId,
    roomId,
    username,
    img,
  }: AttendeeOptions) {
    this.id = id
    this.isSpeaker = isSpeaker
    this.peerId = peerId
    this.roomId = roomId
    this.img = img || ''

    const name = username || 'Usuário Anônimo'
    this.username = name

    const [firstName, lastName] = name.split(/\s/)
    this.firstName = firstName
    this.lastName = lastName
  }
}
