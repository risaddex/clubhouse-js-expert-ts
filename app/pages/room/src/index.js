import RoomSocketBuilder from "./util/roomSocket.js";
const socketBuilder = new RoomSocketBuilder({
    socketUrl: "http://localhost:3000" /* SOCKET_URL */,
    namespace: "room" /* room */
});
const socket = socketBuilder
    .setOnUserConnected((user) => console.log('user connected!', user))
    .setOnUserDisconnected((user) => console.log('user disconnected!', user))
    .setOnRoomUpdated((room) => console.log('room list!', room))
    .build();
const room = {
    id: '0001',
    topic: 'JS expert'
};
const user = {
    img: 'oi.jpg',
    username: 'Danilo_' + Date.now()
};
socket.emit("joinRoom" /* JOIN_ROOM */, { user, room });
