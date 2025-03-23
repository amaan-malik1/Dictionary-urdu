import dictionaryData from '../data/dictionary.json';
import { db } from '../firebase/config';
import { collection, doc, getDoc, query, where, limit, getDocs, orderBy } from 'firebase/firestore';

// Add IDs to words if they don't exist
const wordsWithIds = dictionaryData.words.map((word, index) => ({
    ...word,
    id: word.id || `word_${index}`
}));

/**
 * Search for words in the dictionary
 * @param {string} query - Search query in Urdu or Roman Urdu
 * @returns {Array} Array of matching words
 */
export const searchWords = (query) => {
    if (!query.trim()) return [];
    const searchTerm = query.toLowerCase().trim();
    return wordsWithIds.filter(word =>
        word.word.toLowerCase().includes(searchTerm) ||
        word.roman.toLowerCase().includes(searchTerm)
    );
};

// Cache for word details
const wordCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get detailed information about a specific word
 * @param {string} word - Word to search for (in Urdu or Roman Urdu)
 * @returns {Object|null} Word details or null if not found
 */
export const getWordDetails = async (word) => {
    try {
        if (!word) {
            console.log('No word provided');
            return null;
        }

        console.log('Fetching word details for:', word);
        
        const wordsRef = collection(db, 'words');
        const q = query(
            wordsRef,
            where('word', '==', word.trim().toLowerCase())
        );

        console.log('Executing query...');
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No matching word found');
            return null;
        }

        const wordDoc = snapshot.docs[0];
        const wordData = wordDoc.data();

        console.log('Word found:', wordData);

        return {
            id: wordDoc.id,
            word: wordData.word || '',
            roman: wordData.roman || '',
            definitions: wordData.definitions || [],
            examples: wordData.examples || [],
            categories: wordData.categories || []
        };
    } catch (error) {
        console.error('Error fetching word details:', error);
        throw new Error('Failed to fetch word details');
    }
};

/**
 * Get a word of the day
 * @returns {Object} A word from the dictionary
 */
export const getWordOfDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % wordsWithIds.length;
    return wordsWithIds[index];
};

/**
 * Get random words from the dictionary
 * @param {number} count - Number of random words to return
 * @returns {Array} Array of random words
 */
export const getRandomWords = (count = 5) => {
    const shuffled = [...wordsWithIds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

/**
 * Get words by category
 * @param {string} category - Category to filter by
 * @returns {Array} Array of words in the category
 */
export const getWordsByCategory = (category) => {
    return wordsWithIds.filter(word =>
        word.categories.includes(category)
    );
};

/**
 * Get all available categories
 * @returns {Array} Array of unique categories
 */
export const getAllCategories = () => {
    const categories = new Set();
    wordsWithIds.forEach(word => {
        word.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
};

// Optimized suggestion service
const suggestionCache = new Map();

export const getWordSuggestions = async (searchTerm) => {
    try {
        if (!searchTerm || searchTerm.length < 2) return [];

        const wordsRef = collection(db, 'words');
        const q = query(
            wordsRef,
            where('word', '>=', searchTerm.toLowerCase()),
            where('word', '<=', searchTerm.toLowerCase() + '\uf8ff'),
            orderBy('word'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                word: data.word || '',
                roman: data.roman || '',
                definitions: data.definitions || []
            };
        });
    } catch (error) {
        console.error('Error getting suggestions:', error);
        return [];
    }
};

// Add this function to get recent words
export const getRecentWords = async (limit = 10) => {
    try {
        const wordsRef = collection(db, 'words');
        const q = query(wordsRef, orderBy('createdAt', 'desc'), limit);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                word: data.word || '',
                roman: data.roman || '',
                definitions: data.definitions || []
            };
        });
    } catch (error) {
        console.error('Error getting recent words:', error);
        return [];
    }
};
