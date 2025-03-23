import { db } from '../firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export const getWordDetails = async (word) => {
    try {
        console.log('Fetching word:', word);
        const wordsRef = collection(db, 'words');
        const q = query(wordsRef, where('word', '==', word.trim().toLowerCase()));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('Word not found:', word);
            return null;
        }

        const wordData = snapshot.docs[0].data();
        return {
            id: snapshot.docs[0].id,
            ...wordData
        };
    } catch (error) {
        console.error('Error fetching word:', error);
        throw error;
    }
};

export const getWordSuggestions = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];

    try {
        const wordsRef = collection(db, 'words');
        const q = query(
            wordsRef,
            where('searchTerms', 'array-contains', searchTerm.toLowerCase()),
            limit(10)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            word: doc.data().word,
            roman: doc.data().roman
        }));
    } catch (error) {
        console.error('Error getting suggestions:', error);
        return [];
    }
}; 