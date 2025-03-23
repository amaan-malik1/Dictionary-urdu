import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchWords, getWordDetails } from '../services/dictionaryService';
import { ROUTES } from '../constants/routes';

/**
 * Dictionary Component
 * Main interface for searching and displaying Urdu words
 */
const Dictionary = () => {
    const [word, setWord] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!word.trim()) return;

        setLoading(true);
        setError('');
        try {
            const results = searchWords(word);
            if (results.length > 0) {
                setSearchResults(results);
            } else {
                setError('No words found matching your search');
                setSearchResults([]);
            }
        } catch (err) {
            setError('Error searching for word');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleWordClick = (word) => {
        navigate(`/word/${encodeURIComponent(word.word)}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Urdu Dictionary</h1>

            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Enter a word to search..."
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-red-500 text-sm"
                    >
                        {error}
                    </motion.p>
                )}
            </form>

            <AnimatePresence>
                {searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 space-y-4"
                    >
                        {searchResults.map((result) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => handleWordClick(result)}
                                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
                            >
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-gray-800 mb-1">
                                        {result.word}
                                    </span>
                                    <span className="text-gray-600 mb-2">
                                        {result.roman}
                                    </span>
                                    <p className="text-gray-700">
                                        {result.definitions[0]}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {result.categories.map((category, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dictionary;