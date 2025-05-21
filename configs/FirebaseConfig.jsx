// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrHCfkpGE7nOLwdbJ9G3Ol9udV3JLR0mw",
  authDomain: "ailogomaker-9906b.firebaseapp.com",
  projectId: "ailogomaker-9906b",
  storageBucket: "ailogomaker-9906b.firebasestorage.app",
  messagingSenderId: "712906354659",
  appId: "1:712906354659:web:69d54acc4c7c5c7ec3fad6",
  measurementId: "G-GRRPBQMN1Y"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)