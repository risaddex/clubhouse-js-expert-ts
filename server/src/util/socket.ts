/// <reference path="../../../app/globals.d.ts" />


import * as http from 'http'
import {Server as IOServer} from 'socket.io'
import debug from 'debug'

const log = debug('server:socket')

export default class SocketServer {
  private readonly port: number
  #io:IOServer

  constructor({port}:{port:number}) {
    this.port = port
  }

  async start():Promise<http.Server>{
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Access-Control-Allow':'*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      })

      res.end('hey there!!')
    })
    
    this.#io = new IOServer(server, {
      cors: {
        origin: '*',
        credentials: false
      }
    })
    
    //Valida front end
    const roomSocket = this.#io.of('/roomSocket')
    roomSocket.on('connection', socket => {
      // Emite um evento na conexão do usuário
      socket.emit(socketEvents.USER_CONNECTED, 'socketId se conectou' + socket.id)

      socket.on(socketEvents.JOIN_ROOM, (dados) => {
        log('dados recebidos', dados)
      })
    })

    return new Promise((resolve,reject) => {
      server.on('error', reject)

      server.listen(this.port, () => resolve(server))
    })
  }
}