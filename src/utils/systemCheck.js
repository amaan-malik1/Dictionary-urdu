import { db, auth } from '../services/firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export const systemCheck = async () => {
    const checks = {
        firebase: false,
        firestore: false,
        auth: false,
        wordCollection: false,
        indexes: false
    };

    try {
        // Check Firebase initialization
        if (db) {
            checks.firebase = true;
            console.log('✅ Firebase initialized');
        }

        // Check Firestore connection
        try {
            const testQuery = query(collection(db, 'words'), limit(1));
            const snapshot = await getDocs(testQuery);
            checks.firestore = true;
            checks.wordCollection = !snapshot.empty;
            console.log('✅ Firestore connected');
            console.log(`${snapshot.empty ? '⚠️' : '✅'} Words collection ${snapshot.empty ? 'empty' : 'has data'}`);
        } catch (error) {
            console.error('❌ Firestore check failed:', error);
        }

        // Check Authentication
        if (auth) {
            checks.auth = true;
            console.log('✅ Authentication initialized');
        }

        return {
            success: Object.values(checks).every(check => check),
            checks,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('System check failed:', error);
        return {
            success: false,
            error: error.message,
            checks,
            timestamp: new Date().toISOString()
        };
    }
}; 