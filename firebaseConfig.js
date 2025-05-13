// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDAUtiImFv7VphBCzlmHdbvgEq-e6l9vNk",
    authDomain: "aula-1a155.firebaseapp.com",
    databaseURL: "https://aula-1a155-default-rtdb.firebaseio.com",
    projectId: "aula-1a155",
    storageBucket: "aula-1a155.firebasestorage.app",
    messagingSenderId: "838596536693",
    appId: "1:838596536693:web:d52f1b0faf7461a5f18b3c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
