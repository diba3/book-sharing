import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "book-sharing-89dc3.firebaseapp.com",
  projectId: "book-sharing-89dc3",
  storageBucket: "book-sharing-89dc3.firebasestorage.app",
  messagingSenderId: "883948851870",
  appId: "1:883948851870:web:3500fc3b47fd3074e9618f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
