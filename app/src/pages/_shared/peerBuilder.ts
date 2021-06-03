import Peer, { MediaConnection, PeerJSOption } from 'peerjs'


type CustomPeerArgs = {
  config: {
    id: string
    options: PeerJSOption
  }
  onCall: (media: MediaConnection) => void
}
export class CustomPeerModule extends globalThis.Peer {
  onCall: (media: MediaConnection) => void

  constructor({ config, onCall }: CustomPeerArgs) {
    super(config)
    this.onCall = onCall
  }

  call(...args) {
    const originalCallResult = super.call(...args) as MediaConnection

    this.onCall(originalCallResult)

    return originalCallResult
  }
}
export default class PeerBuilder {
  id: undefined | string
  peerConfig: PeerJSOption
  onError: ListenerCallback
  onConnectionOpened: ListenerCallback
  onCallError: ListenerCallback
  onCallClose: ListenerCallback
  onCallReceived: ListenerCallback
  onStreamReceived: ListenerCallback

  constructor(peerConfig: PeerJSOption) {
    this.peerConfig = peerConfig
    this.onError = () => {}
    this.onConnectionOpened = () => {}
    this.onCallError = () => {}
    this.onCallClose = () => {}
    this.onCallReceived = () => {}
    this.onStreamReceived = () => {}
  }

  setOnError(fn: ListenerCallback) {
    this.onError = fn
    return this
  }

  setOnConnectionOpened(fn: ListenerCallback) {
    this.onConnectionOpened = fn

    return this
  }

  setOnCallError(fn: ListenerCallback) {
    this.onCallError = fn
    return this
  }

  setOnCallClose(fn: ListenerCallback) {
    this.onCallClose = fn
    return this
  }

  setOnCallReceived(fn: ListenerCallback) {
    this.onCallReceived = fn
    return this
  }

  setOnStreamReceived(fn: ListenerCallback) {
    this.onStreamReceived = fn
    return this
  }
  private prepareCallEvent(call: Peer.MediaConnection) {
    call.on('stream', (stream) => this.onStreamReceived(call, stream))
    call.on('error', (error) => this.onCallError(call, error))
    call.on('close', () => this.onCallClose(call))

    this.onCallReceived(call)
  }

  async build(): Promise<CustomPeerModule> {
    const peer = new CustomPeerModule({
      config: {
        id: undefined,
        options: {},
      },
      onCall: this.prepareCallEvent.bind(this),
    })
    peer.on('error', this.onError)
    peer.on('call', this.prepareCallEvent.bind(this))

    return new Promise((resolve) =>
      peer.on('open', () => {
        this.onConnectionOpened(peer)
        return resolve(peer)
      })
    )
  }
}
