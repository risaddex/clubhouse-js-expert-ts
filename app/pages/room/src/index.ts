import { Socket } from "socket.io-client"
import { constants, IAttendee, socketEvents, socketNamespaces, TRoom } from "../../../../global"
import RoomSocketBuilder from "./util/roomSocket.js"


const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.SOCKET_URL,
  namespace: socketNamespaces.room
})

const socket: Socket = socketBuilder
  .setOnUserConnected((user:IAttendee) => console.log('user connected!', user))
  .setOnUserDisconnected((user:IAttendee) => console.log('user disconnected!', user))
  .setOnRoomUpdated((room: TRoom) => console.log('room list!', room))
  .build()

  
const room = {
  id: '0001',
  topic: 'JS expert'
}

const user = {
  img: 'oi.jpg',
  username: 'Danilo_' + Date.now()
}

socket.emit(socketEvents.JOIN_ROOM, {user, room})