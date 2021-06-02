import { constants, IAttendee, RoomData, socketNamespaces } from '../../../../../global'
import RoomController from './room.controller.js'
import RoomSocketBuilder from './util/roomSocketBuilder.js'
import View from './room.view.js'
import PeerBuilder from '../../_shared/peerBuilder.js'
import RoomService from './room.service.js'
import Media from '../../_shared/media.js'

import checkDevice from '../../_shared/checkDevice.js'
import UserDb from '../../_shared/userDb.js'
import Utils from '../../_shared/utils.js'
const urlParams = new URLSearchParams(window.location.search)
const keys = ['id', 'topic']

const urlData = keys.map((key) => [key, urlParams.get(key)])

const room = {
  ...Object.fromEntries(urlData),
}

let user: IAttendee

try {
  user= UserDb.checkIfUserExists()
} catch (error) {
  console.warn(error.message)
  Utils.redirectToLogin();
  
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
// RoomController.initialize(dependencies).catch(e => alert(e.message))

async function initializeWithRetry() {
  try {
    await RoomController.initialize(dependencies)
  } catch (error) {
    console.error(error)
    checkDevice(error)
    setTimeout(() => {
      initializeWithRetry()
    }, 3000)
  }
}

initializeWithRetry()