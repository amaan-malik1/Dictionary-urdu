import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { collection, query, where } from 'firebase/firestore';

export const verifySetup = async () => {
    const checks = {
        database: false,
        wordQuery: false,
        suggestions: false
    };

    try {
        // Check database connection
        if (db) {
            checks.database = true;
            console.log('✅ Database connected');
        }

        // Test word query
        const wordsRef = collection(db, 'words');
        const q = query(wordsRef, limit(1));
        const snapshot = await getDocs(q);

        console.log('📊 Database connection:', snapshot.empty ? 'Empty collection' : 'Collection has data');

        if (!snapshot.empty) {
            const sampleDoc = snapshot.docs[0].data();
            console.log('📝 Sample document structure:', sampleDoc);
        }

        return {
            success: true,
            hasData: !snapshot.empty
        };
    } catch (error) {
        console.error('❌ Verification failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}; 