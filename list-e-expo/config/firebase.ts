import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7-nieUxGUbSL5uGye7O0Ss-twK6MHr4Q",
  authDomain: "list-e-8a990.firebaseapp.com",
  projectId: "list-e-8a990",
  storageBucket: "list-e-8a990.firebasestorage.app",
  messagingSenderId: "761612692070",
  appId: "1:761612692070:web:8726c5c0eb0cded9dc1ba7",
  measurementId: "G-WPEZKSVES9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
