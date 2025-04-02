// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZof8WkeZFBxUfk7tOixVxw16yBldSCSc",
  authDomain: "kensyu10085.firebaseapp.com",
  projectId: "kensyu10085",
  storageBucket: "kensyu10085.firebasestorage.app",
  messagingSenderId: "676207024399",
  appId: "1:676207024399:web:9173eee924e70fef45867a",
  measurementId: "G-YM0SVFZMMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
const analytics = getAnalytics(app);