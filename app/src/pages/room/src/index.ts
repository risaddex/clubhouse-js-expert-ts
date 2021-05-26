import { constants, RoomData, socketNamespaces } from "../../../../../global"
import RoomController from './util/room.controller.js'
import RoomSocketBuilder from "./util/roomSocketBuilder.js"
import View from "./util/room.view.js"


const urlParams = new URLSearchParams(window.location.search)
const keys = ['id', 'topic']

const urlData = keys.map((key) => [key, urlParams.get(key)])

const room = {
  ...Object.fromEntries(urlData)

}
const user = {
  img: 'https://placekitten.com/100/100',
  username: 'Danilo_' + Date.now()
}

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.SOCKET_URL,
  namespace: socketNamespaces.room
})
const roomInfo:RoomData = {user, room} 
  
const dependencies = {
    view: View,
    socketBuilder,
    roomInfo
};
// Será suportado no firefox 89
// await RoomController.initialize(dependencies)

async function initializeWithRetry(){
  try {
    await RoomController.initialize(dependencies)
  } catch (error) {
    console.log(error)
    setTimeout(() => {
      initializeWithRetry()
    }, 2000)
  }
}

initializeWithRetry()