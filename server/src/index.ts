import SocketServer from "./util/socket"
import debug from 'debug'
import { AddressInfo } from "net"

const log = debug('server:socketserver')
const port = Number(process.env.PORT)|| 3000
const socketServer = new SocketServer({ port })

socketServer.start().then((server) => {
  const {port:runningPort} = server.address() as AddressInfo

  log(`socket server is running at ${runningPort}` )
  
})

