// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
// import {getDatabase} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbMgP7hu95oGDWAGWJQdtSxNTc7Cd-73M",
  authDomain: "DigitalSevaks-f1f07.firebaseapp.com",
  projectId: "DigitalSevaks-f1f07",
  storageBucket: "DigitalSevaks-f1f07.firebasestorage.app",
  messagingSenderId: "988131684755",
  appId: "1:988131684755:web:b5542eec46b83c5f7bb866",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  doc,
  setDoc,
  serverTimestamp,
};
