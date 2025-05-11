import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQwSL3nWp6lVy2O3TaOLjKZLOo9xpnFYY",
  authDomain: "uber-clone-f93c9.firebaseapp.com",
  projectId: "uber-clone-f93c9",
  storageBucket: "uber-clone-f93c9.appspot.com", // Check this value - should be projectId.appspot.com
  messagingSenderId: "426438364380",
  appId: "1:426438364380:web:013a884f4a8daeb6af3819",
  measurementId: "G-2FQWPCKGL5"
};

// Initialize Firebase
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

// Export common Firestore field values
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { firebase, auth, firestore, storage, timestamp };
