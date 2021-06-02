import { IRoom } from '../../../../../../global'
import Attendee from './attendee.js'

export default class Room implements IRoom {
  id: string
  topic: string
  subtopic: string
  roomLink: string
  attendeesCount: number
  speakersCount: number
  featuredAttendees?: Attendee[]
  owner: Attendee

  constructor({
    id,
    owner,
    topic,
    subtopic,
    roomLink,
    speakersCount,
    attendeesCount,
    featuredAttendees,
  }: IRoom) {
    this.attendeesCount = attendeesCount
    this.id = id
    this.roomLink = roomLink
    this.subtopic = subtopic || 'Semana JS Expert 4.0'
    this.owner = new Attendee(owner)
    this.speakersCount = speakersCount
    this.topic = topic
    this.featuredAttendees = featuredAttendees?.map((attendee) => new Attendee(attendee))
  }
}
