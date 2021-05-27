export default class Media {
  static async getUserAudio(audio = true) {
    return navigator.mediaDevices.getUserMedia({
      audio
    })
  }
}