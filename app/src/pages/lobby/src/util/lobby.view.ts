import { TUser } from "../../../../../../global.js";
import Room from "../entities/room.js";
import getLobbyTemplate from '../templates/lobbyItem.js'

const roomGrid = document.getElementById('roomGrid')
const btnCreateRoomWithoutTopic = document.getElementById('btnCreateRoomWithoutTopic')
const btnCreateRoomWithTopic = document.getElementById('btnCreateRoomWithTopic')
const txtTopic = document.getElementById('txtTopic') as HTMLInputElement
// const userAvatar = document.getElementById('') as HTMLImageElement

export default class View {

  static clearRoomList(){
    roomGrid.innerHTML = ''
  }

  static generateRoomLink ({id, topic}:Partial<Room>){
    return `./../room/index.html?id=${id}&topic=${topic}`
  }

  static redirectToRoom(topic = '') {
    // it generates a unique id with "99.9%" of safety
    // https://stackoverflow.com/a/44078785/4087199
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2)

    // poderia ser apenas window.location = ...
    window.location.href = this.generateRoomLink({id, topic})
    
  }

  static configureCreateRoomButton() {
    btnCreateRoomWithoutTopic.addEventListener('click', () => {
      this.redirectToRoom()
    })

    btnCreateRoomWithTopic.addEventListener('click', () => {
      const topic = txtTopic.value
      this.redirectToRoom(topic)
    })
  }

  // static updateUserImage({ img, username }:TUser) {
  //   userAvatar.src = img
  //   userAvatar.alt = username
  // }

  static updateRoomList(rooms:Room[]){
    this.clearRoomList()

    rooms?.forEach(room => {
      const params = new Room({
        ...room,
        roomLink: this.generateRoomLink(room)
      })
      const htmlTemplate = getLobbyTemplate(params)

      roomGrid.innerHTML += htmlTemplate
    })
  }
}