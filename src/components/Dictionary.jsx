import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchWords } from '../services/dictionaryService';
import SearchBar from './SearchBar';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Dictionary Component
 * Main interface for searching and displaying Urdu words
 */
const Dictionary = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Test function to check Firebase connection
        async function testFirebase() {
            try {
                const wordsRef = collection(db, 'words');
                const snapshot = await getDocs(wordsRef);
                console.log('Firebase connected! Total words:', snapshot.size);
                snapshot.forEach(doc => {
                    console.log('Sample word:', doc.data());
                });
            } catch (error) {
                console.error('Firebase connection error:', error);
            }
        }

        testFirebase();
    }, []);

    const handleSearch = async (term) => {
        setLoading(true);
        try {
            const results = await searchWords(term);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleWordClick = (wordId) => {
        navigate(`/word/${wordId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Urdu Dictionary</h1>

            <SearchBar onSearch={handleSearch} />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="search-results">
                    {searchResults.map(word => (
                        <motion.div
                            key={word.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => handleWordClick(word.id)}
                            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
                        >
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-800 mb-1">
                                    {word.word}
                                </span>
                                <span className="text-gray-600 mb-2">
                                    {word.roman}
                                </span>
                                <p className="text-gray-700">
                                    {word.definitions[0]}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {word.categories.map((category, idx) => (
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
                </div>
            )}
        </motion.div>
    );
};

export default Dictionary;