import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAIghHY_F7AOh_EZwGFTySwfSUDuBCD2C4",
    authDomain: "aula-37149.firebaseapp.com",
    projectId: "aula-37149",
    storageBucket: "aula-37149.appspot.com",
    messagingSenderId: "729987422452",
    appId: "1:729987422452:web:d1df75f811af17b36926a1"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default db;
