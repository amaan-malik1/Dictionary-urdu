import dictionaryData from '../data/dictionary.json';

/**
 * Get word suggestions based on partial input
 * @param {string} query - Partial word or search term
 * @param {number} limit - Maximum number of suggestions to return
 * @returns {Array} Array of suggested words
 */
export const getSuggestions = (query, limit = 5) => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    const suggestions = dictionaryData.words.filter(word =>
        word.word.toLowerCase().includes(searchTerm) ||
        word.roman.toLowerCase().includes(searchTerm)
    );

    return suggestions.slice(0, limit);
};

/**
 * Get related words based on categories
 * @param {string} word - Word to find related words for
 * @param {number} limit - Maximum number of related words to return
 * @returns {Array} Array of related words
 */
export const getRelatedWords = (word, limit = 5) => {
    if (!word) return [];

    const targetWord = dictionaryData.words.find(w =>
        w.word.toLowerCase() === word.toLowerCase() ||
        w.roman.toLowerCase() === word.toLowerCase()
    );

    if (!targetWord) return [];

    const relatedWords = dictionaryData.words.filter(w => {
        if (w.id === targetWord.id) return false;
        return w.categories.some(category =>
            targetWord.categories.includes(category)
        );
    });

    return relatedWords.slice(0, limit);
}; 