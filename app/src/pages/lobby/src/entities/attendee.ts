

export default class Attendee implements TUser {
  id?: string;
  img: string;
  username: string;

  constructor({img,username,id}:TUser){
    this.id = id
    this.img = img
    this.username = username
  }
}