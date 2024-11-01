// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyRYxu4UIDpQ0ZWdXTsShY8aPR4tiJGZE",
  authDomain: "portfolio-site-f8cd1.firebaseapp.com",
  projectId: "portfolio-site-f8cd1",
  storageBucket: "portfolio-site-f8cd1.firebasestorage.app",
  messagingSenderId: "245036803269",
  appId: "1:245036803269:web:16136e5f773361539ffcac",
  measurementId: "G-1SCGPW2ZF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (if using Firestore)
const db = getFirestore(app);

// Initialize Analytics only if supported
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, db, analytics };