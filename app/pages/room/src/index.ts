import SocketBuilder from "../../_shared/socketBuilder.js"


const socketBuilder = new SocketBuilder({
  socketUrl: constants.SOCKET_URL,
  namespace: socketNamespaces.room
})

const socket = socketBuilder
  .setOnUserConnected((user) => console.log('user connected!', user))
  .setOnUserDisconnected((user) => console.log('user disconnected!', user))
  .build()

  
const room = {
  id: Date.now(),
  topic: 'JS expert'
}

const user = {
  img: 'oi.jpg',
  username: 'Danilo'
}

socket.emit(socketEvents.JOIN_ROOM, {user, room})