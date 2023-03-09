import { boot } from 'quasar/wrappers'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { firebase_db_store } from 'stores/firebase_db_store.js'
import { login_store } from 'stores/login_store.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw14NpErlAwtre2SGikpOIPROO4gcQW4Y",
  authDomain: "iamsharing.firebaseapp.com",
  projectId: "iamsharing",
  storageBucket: "iamsharing.appspot.com",
  messagingSenderId: "188724959550",
  appId: "1:188724959550:web:b7b3a0d3a8b438c282346f",
  measurementId: "G-MLQPD9M71D"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Auth
const auth = getAuth(firebaseApp);

const googleAuthProvider = new GoogleAuthProvider()

// Firestore
const db = getFirestore(firebaseApp);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp);

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot( async ( { app, router } ) => {

  // Store
  const store = firebase_db_store()
  const login_st = login_store()
  await login_st.currentUser()

    router.beforeEach((to, from, next) => {

      // console.log('BEFORE META',to.meta.public)
      // console.log('BEFORE CURRENT USER',currentUser)

    const isLogged = login_st.isLogged
    const isPublicRoute = to.meta.public

      if(isPublicRoute){
        // console.log('public')
        next()
      }else{
        if(isLogged){
          // console.log('is logged and no public route')
          next()
        }else{
          // console.log('no login and no public route')
          router.push('/login')
        }
      }

    });

});

export { db, auth, storage, googleAuthProvider };
