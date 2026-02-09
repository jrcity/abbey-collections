import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDOJ7vn5SqUP3BRoG9gM5BWHzJ2K-Le1Vc",
    authDomain: "abbey-collections.firebaseapp.com",
    projectId: "abbey-collections",
    storageBucket: "abbey-collections.firebasestorage.app",
    messagingSenderId: "860701401189",
    appId: "1:860701401189:web:360dd157274a6e5a33a68c",
    measurementId: "G-B75MZRW7Y9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);