import { TObserver } from "../types"
import attendee from "../entities/attendee"
import Room from "../entities/room";
import room from "../entities/room"

type CustomMapArgs = {
  observer: TObserver
  customMapper(room:Room): Room
}
export default class CustomMap extends Map {
  #observer: TObserver;
  #customMapper:(room:Room) => Room

  constructor({observer, customMapper}:CustomMapArgs){
    super()
    this.#observer = observer
    this.#customMapper = customMapper
  }

  * values(){
    for (const value of super.values()) {
      yield this.#customMapper(value)
    }
  }

  set(key: string, value: attendee | room) {
    const result = super.set(key, value)
    this.#observer.notify(this)

    return result
  }

  delete(args: string){
    const result = super.delete(args)
    this.#observer.notify(this)

    return result
  }
}