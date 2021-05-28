import { ListenerCallback, TUser } from '../../../../../global'
import Attendee from './entities/attendee.js'
import getTemplate from './templates/usersTemplate.js'

const userAvatar = document.getElementById('imgUser') as HTMLImageElement
const toggleImage = document.getElementById('toggleImage') as HTMLImageElement
const roomTopic = document.getElementById('pTopic')
const gridAttendees = document.getElementById('gridAttendees')
const gridSpeakers = document.getElementById('gridSpeakers')
const btnClipBoard = document.getElementById('btnClipBoard')
const btnMicrophone = document.getElementById('btnMicrophone')
const btnClap = document.getElementById('btnClap')

export default class View {
  static updateUserImage({ img, username }: TUser) {
    userAvatar.src = img
    userAvatar.alt = username
  }

  static updateRoomTopic(topic: string) {
    roomTopic.innerHTML = topic
  }

  static updateAttendeesOnGrid(users: Attendee[]) {
    users?.forEach((attendee) => this.addAttendeeOnGrid(attendee))
  }

  static getExistingItemOnGrid({
    id,
    baseElement = document,
  }: {
    id: string
    baseElement?: Partial<Document | HTMLElement>
  }) {
    // busca o nó do documento
    const existingItem = baseElement?.querySelector(`[id="${id}"]`)
    return existingItem
  }

  static removeItemFromGrid(id: string) {
    const existingElement = this.getExistingItemOnGrid({ id })
    existingElement?.remove()
  }

  static addAttendeeOnGrid(attendee: Attendee, removeFirst = false) {
    const user = new Attendee(attendee)
    const htmlTemplate = getTemplate(user)
    const id = user.id
    const baseElement = user.isSpeaker ? gridSpeakers : gridAttendees

    if (removeFirst) {
      this.removeItemFromGrid(id)
      baseElement.innerHTML += htmlTemplate
      return
    }

    const existingItem = this.getExistingItemOnGrid({ id, baseElement })

    if (existingItem) {
      existingItem.innerHTML = htmlTemplate
      return
    }

    baseElement.innerHTML += htmlTemplate
  }

  static showUserFeatures(isSpeaker: boolean) {
    //attendee
    if (!isSpeaker) {
      btnClap.classList.remove('hidden')
      btnMicrophone.classList.add('hidden')
      btnClipBoard.classList.add('hidden')
      return
    }
    //speaker
    btnClap.classList.add('hidden')
    btnMicrophone.classList.remove('hidden')
    btnClipBoard.classList.remove('hidden')
  }

 static createAudioElement({
    muted = true,
    srcObject,
  }: {
    muted: boolean
    srcObject: MediaProvider
  }) {
    const audio = document.createElement('audio')
    audio.muted = muted
    audio.srcObject = srcObject

    audio.addEventListener('loadedmetadata', async () => {
      try {
        await audio.play()
      } catch (error) {
        console.error('error in the audio', error)
      }
    })
  }

  static renderAudioElement({ stream, isCurrentId }) {
    this.createAudioElement({
      muted: isCurrentId,
      srcObject: stream
    })
  }

  static onClapClick(command:ListenerCallback) {
    return () => {
      command()
      const basePath = './../../assets/icons/'
      const handActive = 'hand-solid.svg'
      const handInactive = 'hand.svg'

      if(toggleImage.src.match(handInactive)) {
        toggleImage.src = `${basePath}${handActive}`
        return
      }
      
      toggleImage.src = `${basePath}${handInactive}`

    }
  }

 static configureClapButton(command:ListenerCallback) {
    btnClap.addEventListener('click', this.onClapClick(command) )
  }
}
