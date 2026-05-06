import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCW6DhYYDRDyKhJ1WwpG7m8z71DbR6AioQ",
  authDomain: "homefit-app-4114b.firebaseapp.com",
  projectId: "homefit-app-4114b",
  storageBucket: "homefit-app-4114b.appspot.com",
  messagingSenderId: "531857972199",
  appId: "1:531857972199:web:9a17f4431275dcfde77b42"
};

// 🔧 App init
const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 📦 Firestore
export const db = getFirestore(app);

// ⚡ Cloud Functions (FONTOS!)
export const functions = getFunctions(app, "us-central1");