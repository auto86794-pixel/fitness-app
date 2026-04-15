import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW6DhYDRDyKhJ1WwpG7m8z71DbR6AioQ",
  authDomain: "homefit-app-4114b.firebaseapp.com",
  projectId: "homefit-app-4114b",
  storageBucket: "homefit-app-4114b.firebasestorage.app",
  messagingSenderId: "531857972199",
  appId: "1:531857972199:web:9a17f4431275dcfde77b42",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);