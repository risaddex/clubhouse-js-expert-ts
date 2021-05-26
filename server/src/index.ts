import debug from 'debug'
import Event from 'events'
import { AddressInfo } from 'net'
import { socketEvents } from '../../global.js'
import LobbyController from './controllers/lobbycontroller.js'
import RoomsController from './controllers/roomsController.js'
import SocketServer from './util/socket.js'

const log = debug('server:socketserver')
const port = Number(process.env.PORT) || 3000
const socketServer = new SocketServer({ port })

const server = await socketServer.start()
const { port: runningPort } = server.address() as AddressInfo

const roomsPubSub = new Event()

const roomsController = new RoomsController()

const lobbyController = new LobbyController({
  activeRooms: roomsController.rooms,
  roomsListener: roomsPubSub
})

const namespaces = {
  room: { controller: roomsController, eventEmitter: new Event() },
  lobby: { controller: lobbyController, eventEmitter: roomsPubSub },
}

// Quando o usuário se conecta, emite o evento
// namespaces.room.eventEmitter.on(
//   socketEvents.USER_CONNECTED,
//   namespaces.room.controller.onNewConnection.bind(namespaces.room.controller)
// )

// namespaces.room.eventEmitter.emit(socketEvents.USER_CONNECTED, {id: '001'})
// namespaces.room.eventEmitter.emit(socketEvents.USER_CONNECTED, {id: '002'})
// namespaces.room.eventEmitter.em it(socketEvents.USER_CONNECTED, {id: '003'})

const routeConfig = Object.entries(namespaces).map(
  ([namespace, { controller, eventEmitter }]) => {
    const controllerEvents = controller.getEvents()
    eventEmitter.on(
      socketEvents.USER_CONNECTED,
      controller.onNewConnection.bind(controller)
    )

    return {
      [namespace]: { events: controllerEvents, eventEmitter },
    }
  }
)

socketServer.attachEvents({ routeConfig })

log(`socket server is running at ${runningPort}`)
