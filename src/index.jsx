import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import './index.css';

// Your Firebase configuration
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
); 