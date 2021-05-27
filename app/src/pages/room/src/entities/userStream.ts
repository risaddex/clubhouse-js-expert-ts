export default class UserStream{
  stream
  isFake: boolean
  constructor({stream, isFake}) {
    this.stream = stream
    this.isFake = isFake
  }
}