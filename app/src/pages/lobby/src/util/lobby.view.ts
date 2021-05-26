import Room from "../entities/room.js";
import getLobbyTemplate from '../templates/lobbyItem.js'

const roomGrid = document.getElementById('roomGrid')

export default class View {

  static clearRoomList(){
    roomGrid.innerHTML = ''
  }

  static generateRoomLink ({id, topic}:Room){
    return `/room/index.html?id=${id}&topic=${topic}`
  }
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