import { constants, socketNamespaces } from '../../../../../global.js'
import checkDevice from '../../_shared/checkDevice.js'
import LobbyController from './lobby.controller.js'
import View from './lobby.view.js'
import LobbySocketBuilder from './lobbySocketBuilder.js'

// const user = a

const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.SOCKET_URL,
  namespace: socketNamespaces.lobby,
})

const dependencies = {
  socketBuilder,
  user,
  view: View,
}

// Será suportado no firefox 89
// await LobbyController.initialize(dependencies)

async function initializeWithRetry() {
  try {
    await LobbyController.initialize(dependencies)
  } catch (error) {
    console.error(error)
    // for mobile users
    checkDevice(error)
    setTimeout(() => {
      initializeWithRetry()
    }, 3000)
  }
}

initializeWithRetry()
