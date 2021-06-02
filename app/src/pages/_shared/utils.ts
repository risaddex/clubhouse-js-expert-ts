import { pages } from "../../../../global";

export default class Utils{
  static redirectToLobby() {
    window.location.assign(pages.lobby);
  }
  
  static redirectToLogin(){
    window.location.assign(pages.login);
  }
}