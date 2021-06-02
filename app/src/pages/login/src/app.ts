// // import firebase from 'firebase'
// const firebase = globalThis.firebase;

import checkDevice from '../../_shared/checkDevice.js'
import UserDb from '../../_shared/userDb.js';
import Utils from '../../_shared/utils.js';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

interface ILoginParams {
  provider: /* firebase.auth.GithubAuthProvider  */any
  firebase: /* typeof firebase */any
}


function onLogin({ provider, firebase }: ILoginParams) {
  return async () => {
    try {
      const result = await firebase.auth().signInWithPopup(provider)

      const { user } = result
      const userData = {
        img: user.photoURL,
        username: user.displayName,
      }
      UserDb.insert(userData)

      Utils.redirectToLobby()
    } catch (error) {
      console.error('error', error)
      checkDevice(error)
    }
  }
}

const firebaseConfig= {
  apiKey: 'AIzaSyAwb2TI97y0c8GFsvZVW-QIVIgsFUPrCzs',
  authDomain: 'clubhouse-jsexpert-ts.firebaseapp.com',
  projectId: 'clubhouse-jsexpert-ts',
  storageBucket: 'clubhouse-jsexpert-ts.appspot.com',
  messagingSenderId: '919525273684',
  appId: '1:919525273684:web:4ca3f1968b59c1683d3dc1',
  measurementId: 'G-P8EFD37MXX',
}



try {
  UserDb.checkIfUserExists()
  Utils.redirectToLobby();
} catch (error) {
  console.warn(error.message)
  
}


// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

const provider = new firebase.auth.GithubAuthProvider()

provider.addScope('read:user')

const btnLogin = document.getElementById('btnLogin')
btnLogin.addEventListener('click', onLogin({ provider, firebase }))
