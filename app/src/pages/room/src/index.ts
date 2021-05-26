import { constants, RoomData, socketNamespaces, TUser } from "../../../../../global"
import RoomController from './util/controller.js'
import RoomSocketBuilder from "./util/roomSocket.js"
import View from "./util/view.js"

const room = {
  id: '0001',
  topic: 'JS expert'
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
await RoomController.initialize(dependencies)

// async function initializeWithRetry(){
//   try {
//     await RoomController.initialize(dependencies)
//   } catch (error) {
//     console.log(error)
//     setTimeout(() => {
//       initializeWithRetry()
//     }, 2000)
//   }
// }

// initializeWithRetry()