// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHXN1bAffYuU7xQs0BfOxk7mJO5cBhX7o",
  authDomain: "marketplace-app-cb6b0.firebaseapp.com",
  projectId: "marketplace-app-cb6b0",
  storageBucket: "marketplace-app-cb6b0.appspot.com",
  messagingSenderId: "358109444263",
  appId: "1:358109444263:web:82a52a9a279b084b7d0382",
  measurementId: "G-EPYNFCT1Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore();