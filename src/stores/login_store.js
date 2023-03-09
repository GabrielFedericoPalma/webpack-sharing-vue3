import { defineStore } from 'pinia';
import { db, auth, googleAuthProvider } from 'boot/firebase.js'
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, query, collection, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"

import { firebase_db_store } from './firebase_db_store.js'

export const login_store = defineStore('login_store', {
  state: () => ({
    isLogged: false,
    user: null,
    userUI: null,
  }),
  getters: {

  },
  actions: {
    async currentUser(){

      const self = this

      function authState(){

        return new Promise((resolve, reject) => {
          // ***OBSERVER FIREBASE USER CHANGES***
          const unsubscribe = onAuthStateChanged(auth, user => {

            // console.log('whatch user Fire')

            if (user) {
              // console.log('user login')
              self.isLogged = true
              self.userUI = user.email
              self.user = user
            } else {
              // User is signed out
              // console.log('user logout')
              self.isLogged = false
              self.userUI = ''
              // this.router.push('/login')
            }

            resolve(user)

          }, e => reject(e));

          unsubscribe()
          // ***END OBSERVER FIREBASE USER CHANGES***

        })
      }

      try {
        await authState()
      } catch (error) {
        // console.log(error);
      }


    },
    googleLogin() {

      const self = this
      const store = firebase_db_store()

      store.showSpinner = true

      signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        if(result.user){
          self.currentUser()
          self.firestoreCreateDBUser(result.user.email)
        }else {
          // console.log('no result user')
          store.showSpinner = false
          store.showNotifyFailled('No user founded')
        }

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(error.message)
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        store.showSpinner = false
        store.showNotifyFailled(errorMessage)
      });

    },
    async firestoreCreateDBUser(userEmail){

      const store = firebase_db_store()

      // console.log('userEmail:  ', userEmail)

      const q = query(doc(db, 'users', userEmail))

      const docSnap = await getDoc(q);

      if (docSnap.exists()) {
        // console.log("Doc Exist")
        store.showSpinner = false
        this.router.push('/')
      } else {

        // CREA REGISTRO EN DB USERS

        const usersRef = collection(db, "users");

        await setDoc(doc(usersRef, userEmail), {
          rol: 'editor'
        });
        store.showSpinner = false
        this.router.push('/')
      }

    },
    googleLogout() {
      const store = firebase_db_store()

      signOut(auth).then(() => {
        this.currentUser()
        store.$reset()
        this.router.push('/login')
      }).catch((error) => {
        // console.log(error)
      });

    }

  }
})
