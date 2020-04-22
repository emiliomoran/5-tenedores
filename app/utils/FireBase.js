import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_APIKEY",
  authDomain: "tenedores-e83c8.firebaseapp.com",
  databaseURL: "https://tenedores-e83c8.firebaseio.com",
  projectId: "tenedores-e83c8",
  storageBucket: "tenedores-e83c8.appspot.com",
  messagingSenderId: "961695061767",
  appId: "1:961695061767:web:dff6399442ad85747957a2",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
