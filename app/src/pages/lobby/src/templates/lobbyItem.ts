import Attendee from '../entities/attendee'
import Room from '../entities/room'

function createFeaturedSpeakersTemplate(featuredAttendees:Attendee[]) {
  if (!featuredAttendees.length) return '';

  const attendees = featuredAttendees.map((attendee) => {
    return `<li>${attendee.username} <span role="img" class="emoji">💬</span></li>`
  })

  return attendees.join('')
  
}

export default function getLobbyTemplate(room: Room) {
  return `
  <a id="${room.id}" href="${room.roomLink || '#'}">
  <div class="cards__card">
    <span class="cards__card__topicRoom">
      ${room.subtopic}
      <i class="fa fa-home"></i>
    </span>
    <p class="cards__card__title">
    <p class="cards__card__title">
      ${room.topic}
    </p>
    <div class="cards__card__info">
      <div class="avatar">
        <img src="${room.owner.img}" alt="${room.owner.username}">
      </div>
      <div class="cards__card__info__speakers">
        <ul>
          ${createFeaturedSpeakersTemplate(room.featuredAttendees)}
          <span class="cards__card__info__speakers__listeners">
            ${room.attendeesCount} <i class="fa fa-user"></i> / ${room.speakersCount}
            <i class="fa fa-comment"></i>
          </span>
        </ul>
      </div>
    </div>
  </div>
  </a>
`
}