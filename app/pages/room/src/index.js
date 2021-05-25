import SocketBuilder from "../../_shared/socketBuilder.js";

const socketBuilder = new SocketBuilder({
    socketUrl: "http://localhost:3000" /* SOCKET_URL */,
    namespace: "room" /* room */
});
const socket = socketBuilder
    .setOnUserConnected((user) => console.log('user connected!', user))
    .setOnUserDisconnected((user) => console.log('user disconnected!', user))
    .build();
const room = {
    id: Date.now(),
    topic: 'JS expert'
};
const user = {
    img: 'oi.jpg',
    username: 'Danilo'
};
socket.emit("joinRoom" /* JOIN_ROOM */, { user, room });
