import { constants, IAttendee, ListenerCallback, TUser } from "../../../../global"

const FIELD = constants.STORAGE_KEY

export default class UserDb {
  static insert(data: IAttendee) {
    localStorage.setItem(FIELD, JSON.stringify(data))
  }

  static get():IAttendee {
    const result = localStorage.getItem(FIELD)
    return JSON.parse(result || '{}') as TUser
  }

  /**
   * 
   * @param cb A callback to be executed if the currentUser doesn't exists
   */
   static checkIfUserExists(cb: ListenerCallback):IAttendee {
    const currentUser = UserDb.get()
    if (!Object.keys(currentUser).length) {
      cb();
      return;
    }
    return currentUser
  }

  
}