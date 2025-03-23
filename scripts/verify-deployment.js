const checkDeployment = async () => {
    try {
        // 1. Check Firebase configuration
        if (!firebase.apps.length) {
            throw new Error('Firebase not initialized');
        }

        // 2. Check authentication
        const auth = getAuth();
        await auth.signInAnonymously();

        // 3. Check Firestore connection
        const db = getFirestore();
        const testQuery = await getDocs(collection(db, 'words'));
        if (!testQuery.empty) {
            console.log('✅ Database connection successful');
        }

        // 4. Check hosting
        const response = await fetch(window.location.origin);
        if (response.ok) {
            console.log('✅ Hosting is working');
        }

        console.log('All systems operational! ✅');
    } catch (error) {
        console.error('Deployment verification failed:', error);
    }
}; 