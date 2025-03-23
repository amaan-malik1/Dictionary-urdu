import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBEcujN_SfTF7YgaQAZcHlq0SUqXxMB-9Q",
    authDomain: "learnurdu-18e49.firebaseapp.com",
    projectId: "learnurdu-18e49",
    storageBucket: "learnurdu-18e49.firebasestorage.app",
    messagingSenderId: "293890203517",
    appId: "1:293890203517:web:cf96bc65e1544c5f92b614",
    measurementId: "G-8SZLBENGWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth }; 