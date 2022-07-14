import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDnlXaQGOT5c048rAzE6wGP8J11YcIKtMI",
  authDomain: "fastmove-eace5.firebaseapp.com",
  databaseURL: "https://fastmove-eace5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fastmove-eace5",
  storageBucket: "fastmove-eace5.appspot.com",
  messagingSenderId: "1014488458657",
  appId: "1:1014488458657:web:ef32b74a33e8cbdbd917e0",
  measurementId: "G-3EZV682JT2"
};


firebase.initializeApp(firebaseConfig);
export default firebase;