const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBEcujN_SfTF7YgaQAZcHlq0SUqXxMB-9Q",
    authDomain: "learnurdu-18e49.firebaseapp.com",
    projectId: "learnurdu-18e49",
    storageBucket: "learnurdu-18e49.firebasestorage.app",
    messagingSenderId: "293890203517",
    appId: "1:293890203517:web:cf96bc65e1544c5f92b614",
    measurementId: "G-8SZLBENGWD"
};

async function verifyProduction() {
    try {
        console.log('🔍 Starting 