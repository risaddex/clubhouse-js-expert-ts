import { BaseAttendee, BaseRoom } from '../../../global.js'
import Attendee from './attendee.js'

type RoomArgs = {
  id: string
  topic: string
  attendeesCount: number
  speakersCount: number
  featuredAttendees?: Attendee[]
  owner: Attendee
  users: Set<Attendee>
}
export default class Room implements BaseRoom {
  id: string
  topic: string
  attendeesCount: number
  speakersCount: number
  featuredAttendees?: Attendee[]
  owner: Attendee
  users: Set<Attendee>

  constructor({
    attendeesCount,
    id,
    owner,
    speakersCount,
    topic,
    users,
    featuredAttendees,
  }:RoomArgs) {
    this.attendeesCount = attendeesCount
    this.id = id
    this.owner = owner
    this.speakersCount = speakersCount
    this.topic = topic
    this.users = users
    this.featuredAttendees = featuredAttendees?.map(attendee => new Attendee(attendee))
  }
}
