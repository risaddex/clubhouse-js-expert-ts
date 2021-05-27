export default class Media {
  static async getUserAudio(audio = true) {
    return await navigator.mediaDevices.getUserMedia({
      audio
    })
  }
  //se o usuário não tem permissão, mandará uma stream fake de audio
  //workaround
  static createMediaStreamFake(){
    return new MediaStream([
      this.createEmptyAudioTrack()
    ])
  }

  static createEmptyAudioTrack() {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    // creates an empty track
    const destination = oscillator.connect(audioContext.createMediaStreamDestination())
    oscillator.start()
    
    //@ts-ignore
    const [track] = destination.stream.getAudioTracks() 
    return Object.assign(track, { enabled: false })
  }
} 