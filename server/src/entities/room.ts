import { BaseAttendee, BaseRoom } from '../../../global.js'
import Attendee from './attendee.js'

export default class Room implements BaseRoom {
  id: string
  topic: string
  attendeesCount: number
  speakersCount: number
  featuredAttendees?: BaseAttendee[]
  owner: BaseAttendee
  users: Set<BaseAttendee>

  constructor({
    attendeesCount,
    id,
    owner,
    speakersCount,
    topic,
    users,
    featuredAttendees,
  }:BaseRoom) {
    this.attendeesCount = attendeesCount
    this.id = id
    this.owner = owner
    this.speakersCount = speakersCount
    this.topic = topic
    this.users = users
    this.featuredAttendees = featuredAttendees?.map(attendee => new Attendee(attendee))
  }
}
