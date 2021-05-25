import { IAttendee } from '../../../global'
import Attendee from './attendee.js'

export default class Room{
  readonly id: string
  readonly topic: string
  readonly attendeesCount: number
  readonly speakersCount: number
  readonly featuredAttendees?: IAttendee[]
  readonly owner: Attendee
  readonly users: Set<IAttendee>

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
