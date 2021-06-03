

export default class Utils{
  static redirectToLobby() {
    window.location.assign(constants.pages.lobby);
  }
  
  static redirectToLogin(){
    window.location.assign(constants.pages.login);
  }
}