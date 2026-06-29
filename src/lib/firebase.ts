import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5v5NshBHzFR5szj9T7ftJplMyZhw6X20",
  authDomain: "afribuy-84c05.firebaseapp.com",
  projectId: "afribuy-84c05",
  storageBucket: "afribuy-84c05.firebasestorage.app",
  messagingSenderId: "251861008994",
  appId: "1:251861008994:web:2930653c3842337dbb873b",
  measurementId: "G-3Y8CLV9XM1",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export const STORE_NAME = "Afribuy";
