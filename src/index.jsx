import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import * as Sentry from "@sentry/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below.
serviceWorkerRegistration.register({
    onUpdate: (registration) => {
        // Show a notification to the user about the update
        const updateAvailable = window.confirm(
            'A new version of the app is available. Load the new version?'
        );

        if (updateAvailable && registration && registration.waiting) {
            // Send a message to the service worker to skip waiting
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });

            // Reload the page to activate the new service worker
            window.location.reload();
        }
    },
    onSuccess: (registration) => {
        console.log('Service worker registered successfully');
    }
});

Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: process.env.NODE_ENV
}); 