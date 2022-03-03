import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCAOxvJqMZ5Q-tzzcnoKO44iObowzuqOPE",
  authDomain: "appgeb.firebaseapp.com",
  projectId: "appgeb",
  storageBucket: "appgeb.appspot.com",
  messagingSenderId: "508175556379",
  appId: "1:508175556379:web:f09ff2aa5b07b4cb77bdbe",
  measurementId: "G-BE7C55CG24",
};

const app = firebase.initializeApp(firebaseConfig);

export default app;
