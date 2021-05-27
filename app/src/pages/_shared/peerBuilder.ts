import { ListenerCallback } from '../../../../global'
import Peer, { PeerJSOption } from 'peerjs'

type CustomPeerArgs = {
  config: PeerJSOption
  onCall():void
  call(id: string, stream: MediaStream, options?: Peer.CallOption): Peer.MediaConnection;

}
class CustomPeerModule extends globalThis.Peer {
  constructor({config, onCall}:CustomPeerArgs) {
    super(config)

    this.onCall = onCall
  }

  call(...args) {
    super.call()
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

  constructor(peerConfig: PeerJSOption, id = undefined) {
    this.id = id
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
  private prepareCallEvent(call:Peer.MediaConnection){
    call.on('stream', (stream) => this.onStreamReceived(call, stream))
    call.on('error', (error) => this.onCallError(call, error))
    call.on('closed', () => this.onCallClose(call))

    this.onCallReceived(call)
  }

  build(): Promise<Peer> {
    const peer: Peer = new globalThis.Peer(this.peerConfig)
    peer.on('error', this.onError)
    peer.on('call', this.prepareCallEvent.bind(this))
    peer.call

    return new Promise((resolve) =>
      peer.on('open', () => {
        this.onConnectionOpened(peer)
        return resolve(peer)
      })
    )
  }
}
