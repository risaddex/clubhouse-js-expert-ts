import { constants, RoomData, socketNamespaces } from '../../../../../global'
import RoomController from './room.controller.js'
import RoomSocketBuilder from './util/roomSocketBuilder.js'
import View from './room.view.js'
import PeerBuilder from '../../_shared/peerBuilder.js'
import RoomService from './room.service.js'
import Media from '../../_shared/media.js'

const urlParams = new URLSearchParams(window.location.search)
const keys = ['id', 'topic']

const urlData = keys.map((key) => [key, urlParams.get(key)])

const room = {
  ...Object.fromEntries(urlData),
}
const user = {
  img: 'https://placekitten.com/100/100',
  username: 'Danilo ' + Date.now(),
}

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.SOCKET_URL,
  namespace: socketNamespaces.room,
})

const roomService = new RoomService({
  media: Media
})

const peerBuilder = new PeerBuilder({})

const roomInfo: RoomData = { user, room }

const dependencies = {
  view: View,
  socketBuilder,
  peerBuilder,
  roomService,
  roomInfo,
}
// Será suportado no firefox 89
// await RoomController.initialize(dependencies)

async function initializeWithRetry() {
  try {
    await RoomController.initialize(dependencies)
  } catch (error) {
    console.error(error)
    // for mobile users
    const mobileDevicesUA = [
      'iPhone',
      'Android',
      'Opera Mobi',
      'Opera Mini',
      'Windows Phone ',
      'Mobile Safari',
    ]
    const isMobile = mobileDevicesUA.some((item) =>
      navigator.userAgent.indexOf(item)
    )

    if (isMobile) {
      alert(error)
    }
    setTimeout(() => {
      initializeWithRetry()
    }, 3000)
  }
}