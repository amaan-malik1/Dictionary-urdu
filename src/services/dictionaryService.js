import { db } from '../firebase/config';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';

// Dictionary data will be cached here
const cache = {
  index: null,
  letters: {},
  words: new Map(),
  searches: new Map(),
  timeout: 5 * 60 * 1000 // 5 minutes
};

// Helper function to fetch JSON from Firebase Hosting
async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

// Get the full dictionary index (just words and roman representations)
export async function getDictionaryIndex() {
  if (!cache.index) {
    try {
      cache.index = await fetchJson('/data/index.json');
    } catch (error) {
      console.error('Error fetching dictionary index:', error);
      return [];
    }
  }
  return cache.index;
}

// Search words
export async function searchWords(searchTerm) {
  if (!searchTerm?.trim()) return [];

  const cacheKey = `search_${searchTerm}`;
  const cached = cache.searches.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < cache.timeout)) {
    return cached.data;
  }

  try {
    const wordsRef = collection(db, 'words');
    const searchTermLower = searchTerm.toLowerCase().trim();

    const [urduResults, romanResults] = await Promise.all([
      getDocs(query(
        wordsRef,
        where('word', '>=', searchTermLower),
        where('word', '<=', searchTermLower + '\uf8ff'),
        limit(10)
      )),
      getDocs(query(
        wordsRef,
        where('roman', '>=', searchTermLower),
        where('roman', '<=', searchTermLower + '\uf8ff'),
        limit(10)
      ))
    ]);

    const results = Array.from(new Set([
      ...urduResults.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...romanResults.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ]));

    // Cache the results
    cache.searches.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Get word details
export async function getWordDetails(wordId) {
  if (!wordId) return null;

  try {
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('id', '==', wordId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('Error getting word details:', error);
    return null;
  }
}

// Get word suggestions
export async function getWordSuggestions(term) {
  if (!term?.trim()) return [];

  try {
    const wordsRef = collection(db, 'words');
    const searchTermLower = term.toLowerCase().trim();

    const q = query(
      wordsRef,
      where('searchTerms', 'array-contains', searchTermLower),
      limit(5)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}

// Get word of the day
export async function getWordOfDay() {
  try {
    // Try Firestore first for a curated word of the day
    const wordsRef = collection(db, 'wordOfDay');
    const q = query(wordsRef, orderBy('date', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const wordOfDayData = snapshot.docs[0].data();
      if (wordOfDayData.wordId) {
        const wordDetails = await getWordDetails(wordOfDayData.wordId);
        return wordDetails;
      }
    }

    // Fall back to selecting a random word from the index
    if (!cache.index) {
      await getDictionaryIndex();
    }

    if (cache.index && cache.index.length > 0) {
      const randomIndex = Math.floor(Math.random() * cache.index.length);
      const randomWord = cache.index[randomIndex];
      return await getWordDetails(randomWord.id);
    }

    // Default fallback word
    return {
      id: 'salam',
      word: 'سلام',
      roman: 'salam',
      pronunciation: 'sa-laam',
      definitions: ['Peace', 'Greeting'],
      examples: ['السلام علیکم', 'سلام کرنا'],
      categories: ['Greeting', 'Common']
    };
  } catch (error) {
    console.error('Error getting word of day:', error);

    // Return a default word on error
    return {
      id: 'salam',
      word: 'سلام',
      roman: 'salam',
      pronunciation: 'sa-laam',
      definitions: ['Peace', 'Greeting'],
      examples: ['السلام علیکم', 'سلام کرنا'],
      categories: ['Greeting', 'Common']
    };
  }
}

// Get recent words
export async function getRecentWords() {
  try {
    // Try to get recently added words from Firestore
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Fall back to a selection from the static dictionary
    if (!cache.index) {
      await getDictionaryIndex();
    }

    if (cache.index && cache.index.length > 0) {
      // Get a selection of words across the alphabet
      const recentWords = [];
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';

      for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const letterWords = cache.index.filter(word => word.roman.charAt(0).toLowerCase() === letter);
        const randomIndex = Math.floor(Math.random() * letterWords.length);
        recentWords.push(letterWords[randomIndex]);
      }

      return recentWords.slice(0, 10);
    }

    return [];
  } catch (error) {
    console.error('Error getting recent words:', error);
    return [];
  }
}

/**
 * Get words by category
 * @param {string} category - Category to filter by
 * @param {number} limitCount - Number of words to retrieve
 * @returns {Promise<Array>} List of words in the category
 */
export const getWordsByCategory = async (category, limitCount = 20) => {
  try {
    const wordsRef = collection(db, 'words');
    const q = query(
      wordsRef,
      where('categories', 'array-contains', category),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting words by category:', error);
    return [];
  }
};

/**
 * Get all available categories
 * @returns {Promise<Array>} List of all categories
 */
export const getAllCategories = async () => {
  try {
    // This would typically come from a separate 'categories' collection
    // For now, we'll query a limited set of words and extract categories
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, limit(100));
    const snapshot = await getDocs(q);

    const categories = new Set();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach(category => categories.add(category));
      }
    });

    return Array.from(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Clear cache function for testing or manual cache clearing
export const clearCache = () => {
  cache.index = null;
  cache.letters = {};
  cache.words.clear();
  cache.searches.clear();
  console.log('Dictionary cache cleared');
};
