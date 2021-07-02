import type firebase from 'firebase'
// const firebase = globalThis.firebase;

import checkDevice from '../../_shared/checkDevice.js'
import UserDb from '../../_shared/userDb.js'
import Utils from '../../_shared/utils.js'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

interface ILoginParams {
  provider: /* firebase.auth.GithubAuthProvider  */ any
  firebase: /* typeof firebase */ any
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

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

try {
  UserDb.checkIfUserExists()
  Utils.redirectToLobby()
} catch (error) {
  console.warn(error.message)
}

// Initialize Firebase
// firebase is been used as cdn so we need tell ts to ignore it
// (we are using only types here so we need tell that to typescript)
// @ts-expect-error
firebase.initializeApp(firebaseConfig)
// @ts-expect-error
firebase.analytics()

// @ts-expect-error
const provider = new firebase.auth.GithubAuthProvider()

provider.addScope('read:user')

const btnLogin = document.getElementById('btnLogin')
btnLogin?.addEventListener('click', onLogin({ provider, firebase }))
