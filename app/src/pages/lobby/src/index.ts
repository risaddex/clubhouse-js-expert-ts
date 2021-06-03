
import checkDevice from '../../_shared/checkDevice.js'
import UserDb from '../../_shared/userDb.js'
import Utils from '../../_shared/utils.js'
import LobbyController from './lobby.controller.js'
import View from './lobby.view.js'
import LobbySocketBuilder from './lobbySocketBuilder.js'


let user:IAttendee

try {
  user = UserDb.checkIfUserExists();
} catch (error) {
  console.warn(`${error.message}, redirecting to login.`)
  Utils.redirectToLogin();
  
}

const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.URLS.SOCKET_URL,
  namespace: constants.socketNamespaces.lobby,
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
