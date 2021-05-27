type UserStreamArgs = {
  stream: MediaStream
  isFake: boolean
}
export default class UserStream {
  stream: MediaStream
  isFake: boolean
  constructor({ stream, isFake }: UserStreamArgs) {
    this.stream = stream
    this.isFake = isFake
  }
}
