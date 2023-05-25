// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA3FlyoXlU4HXnUNsBFd2S5vZdkqZWgnxc",
  authDomain: "sentimen-analisis-ai-8c21f.firebaseapp.com",
  databaseURL:
    "https://sentimen-analisis-ai-8c21f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sentimen-analisis-ai-8c21f",
  storageBucket: "sentimen-analisis-ai-8c21f.appspot.com",
  messagingSenderId: "927789617649",
  appId: "1:927789617649:web:e9dbd6fcdad0b34bdb7450",
  measurementId: "G-5JZ1SCDR8P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);