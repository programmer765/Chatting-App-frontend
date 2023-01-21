// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4wcP-u-RCZvHQi4tyPgeii1NrLuG2iug",
  authDomain: "whatsapp-clone-1db83.firebaseapp.com",
  projectId: "whatsapp-clone-1db83",
  storageBucket: "whatsapp-clone-1db83.appspot.com",
  messagingSenderId: "709857020147",
  appId: "1:709857020147:web:e1fe9c1c7f043e64be4f86",
  measurementId: "G-W2S8CPG8PF",
};

const firebaseapp = firebase.initializeApp(firebaseConfig);
const auth = firebaseapp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
