
declare const enum constants {
  SOCKET_URL = 'http://localhost:3000',
}

declare const enum socketEvents {
  USER_CONNECTED = 'userConnection',
  USER_DISCONNECTED = 'userDisconnection',
  JOIN_ROOM = 'joinRoom'
}

declare const enum socketNamespaces {
  room = 'room',
  lobby = 'lobby',
}

declare type SocketBuilderOptions = {
  socketUrl: string;
  namespace:string
}
