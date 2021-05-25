export default class Room {
    constructor({ attendeesCount, id, owner, speakersCount, topic, users, featuredAttendees, }) {
        this.attendeesCount = attendeesCount;
        this.id = id;
        this.owner = owner;
        this.speakersCount = speakersCount;
        this.topic = topic;
        this.users = users;
        this.featuredAttendees = featuredAttendees;
    }
}
