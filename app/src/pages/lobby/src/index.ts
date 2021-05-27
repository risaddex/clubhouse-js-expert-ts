import { constants, socketNamespaces } from '../../../../../global.js'
import LobbyController from './lobby.controller.js'
import View from './lobby.view.js'
import LobbySocketBuilder from './lobbySocketBuilder.js'

const user = {
  img: 'https://placekitten.com/100/100',
  username: 'Danilo_' + Date.now(),
}

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
// LobbyController.initialize(dependencies).catch((e) => {
//   alert(e.message)
// })

async function initializeWithRetry() {
  try {
    await LobbyController.initialize(dependencies)
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

initializeWithRetry()
