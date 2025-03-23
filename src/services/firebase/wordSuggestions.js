import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const fetchWordSuggestions = async (searchTerm) => {
    const wordsRef = collection(db, 'words');
    const q = query(
        wordsRef,
        where('searchTerms', 'array-contains', searchTerm.toLowerCase()),
        limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().word);
}; 