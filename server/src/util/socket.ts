import debug from 'debug'
import http from 'http'
import { Server } from 'socket.io'
import { RouteConfig, socketEvents, socketNamespaces } from '../types'

const log = debug('server:socket')

export default class SocketServer {
  #io: Server
  port: number
  namespaces = {} as socketNamespaces

  constructor({ port }: { port: number }) {
    this.port = port
    
  }
  // expected shape
  // [
  //     {
  //         room: {
  //             events,
  //             eventEmitter
  //         }
  //     }
  // // ]
  attachEvents({ routeConfig }: { routeConfig: RouteConfig[] }) {
    for (const routes of routeConfig) {
      log(routes)
      log(routeConfig)
      log(Object.entries(routes))
      for (const [namespace, { events, eventEmitter }] of Object.entries(
        routes
        )) {
        
        const route = (this.namespaces[namespace] = this.#io.of(
          `/${namespace}`
        ))
        route.on('connection', (socket) => {
          for (const [functionName, functionValue] of events) {
            socket.on(functionName, (...args) => functionValue(socket, ...args))
          }

          eventEmitter.emit(socketEvents.USER_CONNECTED, socket)
        })
      }
    }
  }

  async start(): Promise<http.Server> {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      })

      res.end('hey there!!')
    })

    this.#io = new Server(server, {
      cors: {
        origin: '*',
        credentials: false,
      },
    })

    return new Promise((resolve, reject) => {
      server.on('error', reject)

      server.listen(this.port, () => resolve(server))
    })
  }
}
