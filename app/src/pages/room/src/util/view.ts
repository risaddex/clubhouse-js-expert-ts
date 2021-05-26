import Attendee from '../entities/attendee.js'
import getTemplate from './templates/usersTemplate.js'

const userAvatar = document.getElementById('imgUser') as HTMLImageElement
const roomTopic = document.getElementById('pTopic')
const gridAttendees = document.getElementById('gridAttendees')
const gridSpeakers = document.getElementById('gridSpeakers')

export default class View {
  static updateUserImage({ img, username }: { img: string; username: string }) {
    userAvatar.src = img
    userAvatar.alt = username
  }

  static updateRoomTopic(topic: string) {
    roomTopic.innerHTML = topic
  }

  static updateAttendeesOnGrid(users: Attendee[]) {
    users.forEach((attendee) => this.addAttendeeOnGrid(attendee))
  }

  static getExistingItemOnGrid({ id, baseElement }:{id:string; baseElement?:HTMLElement}) {
    // busca o nó do documento
    const existingItem = baseElement?.querySelector(`[id="${id}"]`)
    return existingItem
  }

  static removeItemFromGrid(id: string) {
    const existingElement = this.getExistingItemOnGrid({ id })
    existingElement?.remove()
  }

  static  addAttendeeOnGrid(attendee: Attendee, removeFirst = false) {
    const user = new Attendee(attendee)
    const htmlTemplate =  getTemplate(user)
    const id = user.id
    const baseElement = user.isSpeaker ? gridSpeakers : gridAttendees

    if (removeFirst) {
      View.removeItemFromGrid(user.id)
      baseElement.innerHTML += htmlTemplate
      return;
    }

    const existingItem = this.getExistingItemOnGrid({id, baseElement})

    if (existingItem) {
      existingItem.innerHTML = htmlTemplate
      return;
    }

    baseElement.innerHTML += htmlTemplate
  }
}
