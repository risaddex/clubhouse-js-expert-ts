import debug from 'debug';
import http from 'http';
import { Server } from 'socket.io';
const log = debug('server:socket');
export default class SocketServer {
    constructor({ port }) {
        this.port = port;
        this.namespaces = {};
    }
    #io;
    // expected shape
    // [
    //     {
    //         room: {
    //             events,
    //             eventEmitter
    //         }
    //     }
    // // ]
    attachEvents({ routeConfig }) {
        for (const routes of routeConfig) {
            for (const [namespace, { events, eventEmitter }] of Object.entries(routes)) {
                const route = (this.namespaces[namespace] = this.#io.of(`/${namespace}`));
                route.on('connection', (socket) => {
                    for (const [functionName, functionValue] of events) {
                        socket.on(functionName, (...args) => functionValue(socket, ...args));
                    }
                    eventEmitter.emit("userConnection" /* USER_CONNECTED */, socket);
                });
            }
        }
    }
    async start() {
        const server = http.createServer((req, res) => {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            });
            res.end('hey there!!');
        });
        this.#io = new Server(server, {
            cors: {
                origin: '*',
                credentials: false,
            },
        });
        return new Promise((resolve, reject) => {
            server.on('error', reject);
            server.listen(this.port, () => resolve(server));
        });
    }
}
