import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const addBookmark = async (userId, word) => {
    try {
        const bookmarkRef = doc(db, 'bookmarks', `${userId}_${word.id}`);
        await setDoc(bookmarkRef, {
            userId,
            wordId: word.id,
            word: word.word,
            roman: word.roman,
            definitions: word.definitions,
            examples: word.examples,
            categories: word.categories,
            pronunciation: word.pronunciation,
            createdAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error adding bookmark:', error);
        throw error;
    }
};

export const removeBookmark = async (userId, wordId) => {
    try {
        const bookmarkRef = doc(db, 'bookmarks', `${userId}_${wordId}`);
        await deleteDoc(bookmarkRef);
        return true;
    } catch (error) {
        console.error('Error removing bookmark:', error);
        throw error;
    }
};

export const getUserBookmarks = async (userId) => {
    try {
        const bookmarksRef = collection(db, 'bookmarks');
        const q = query(bookmarksRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        throw error;
    }
};

export const isWordBookmarked = async (userId, wordId) => {
    try {
        const bookmarkRef = doc(db, 'bookmarks', `${userId}_${wordId}`);
        const docSnap = await getDoc(bookmarkRef);
        return docSnap.exists();
    } catch (error) {
        console.error('Error checking bookmark status:', error);
        throw error;
    }
}; 