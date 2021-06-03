const FIELD = constants.URLS.STORAGE_KEY
export default class UserDb {
  static insert(data: IAttendee) {
    localStorage.setItem(FIELD, JSON.stringify(data))
  }

  // public get():IAttendee {
  //   const result = localStorage.getItem(FIELD)
  //   return JSON.parse(result || '{}') as IAttendee
  // }

  /**
   *
   * @param onYes A callback to be executed if the currentUser does exists
   * @param onNo A callback to be executed if the currentUser doesn't exists
   */
  static checkIfUserExists(): IAttendee {
    const result = localStorage.getItem(FIELD)
    const currentUser = JSON.parse(result || '{}') as IAttendee

    if (Object.keys(currentUser).length) {
      return currentUser
    } else {
      throw new Error("User not found")
    }
  }
}
