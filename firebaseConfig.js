import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAIghHY_F7AOh_EZwGFTySwfSUDuBCD2C4",
  authDomain: "aula-37149.firebaseapp.com",
  projectId: "aula-37149",
  storageBucket: "aula-37149.appspot.com",
  messagingSenderId: "729987422452",
  appId: "1:729987422452:web:a6aff047016dad2c6926a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);