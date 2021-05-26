import Attendee from './attendee.js'

export default class Room {
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
  }: Room) {
    this.attendeesCount = attendeesCount
    this.id = id
    this.owner = owner
    this.speakersCount = speakersCount
    this.topic = topic
    this.users = users
    this.featuredAttendees = featuredAttendees
  }
}
