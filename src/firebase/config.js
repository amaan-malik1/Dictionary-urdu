import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Use environment variables for configuration
const firebaseConfig = {
    // Verify these values match your Firebase project settings
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

// Initialize Firestore with persistence
const db = getFirestore(app);

// Enable offline persistence (with error handling)
try {
    enableIndexedDbPersistence(db)
        .then(() => console.log('Offline persistence enabled'))
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser does not support offline persistence.');
            } else {
                console.error('Persistence error:', err);
            }
        });
} catch (error) {
    console.error('Failed to enable persistence:', error);
}

// Initialize Authentication
const auth = getAuth(app);

// Initialize Analytics conditionally
let analytics = null;
isSupported().then(supported => {
    if (supported) {
        analytics = getAnalytics(app);
        console.log('Analytics initialized');
    } else {
        console.log('Analytics not supported in this environment');
    }
}).catch(err => {
    console.error('Analytics initialization error:', err);
});

// Add error handling for initialization
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? 'logged in' : 'logged out');
});

// Add some debug logging
console.log('Firebase initialized:', app.name);

// Enable analytics logging in production only
if (process.env.NODE_ENV === 'production') {
    analytics.setAnalyticsCollectionEnabled(true);
}

export { db, analytics };

export default app; 