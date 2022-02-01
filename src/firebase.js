import {initializeApp} from 'firebase/app'
import {
    getFirestore,
    collection,
    
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAWyaert4lXg1t-FEetr8iJ8uJuXObQTlw",
    authDomain: "bing-qi-link.firebaseapp.com",
    projectId: "bing-qi-link",
    storageBucket: "bing-qi-link.appspot.com",
    messagingSenderId: "1059977078582",
    appId: "1:1059977078582:web:d994cdff17fbee23ab3597"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const db = getFirestore()

// collection ref
export const colRef = collection(db, 'short')