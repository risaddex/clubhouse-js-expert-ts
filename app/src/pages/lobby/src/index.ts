import { constants, socketNamespaces } from "../../../../../global.js";
import LobbyController from "./util/lobby.controller.js";
import View from "./util/lobby.view.js";
import LobbySocketBuilder from "./util/lobbySocketBuilder.js";

const user = {
  img: 'https://placekitten.com/100/100',
  username: 'Danilo_' + Date.now()
}


const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.SOCKET_URL,
  namespace: socketNamespaces.lobby
})

const dependencies = {
  socketBuilder,
  user,
  view: View,
}

// Será suportado no firefox 89
// await RoomController.initialize(dependencies)

async function initializeWithRetry(){
  try {
    await LobbyController.initialize(dependencies)
  } catch (error) {
    console.log(error)
    setTimeout(() => {
      initializeWithRetry()
    }, 2000)
  }
}

initializeWithRetry()
