import { Socket } from "socket.io";
import { RoomData } from "../../global";

declare abstract class BaseController {
  onNewConnection(socket:Socket):void

  getEvents():Map<string, Function>

  joinRoom(socket: Socket, { user, room }: RoomData):void
  
  disconnect(socket: Socket):void
}

declare type TObserver = {
  notify(observable: any): void
}
