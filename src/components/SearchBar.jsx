import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWordSuggestions } from '../services/dictionaryService';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchTerm.trim() || searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const results = await getWordSuggestions(searchTerm);
                setSuggestions(results);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        navigate(`/word/${encodeURIComponent(searchTerm)}`);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (word) => {
        navigate(`/word/${encodeURIComponent(word)}`);
        setShowSuggestions(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search for an Urdu word..."
                    className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                >
                    Search
                </button>
            </form>

            {showSuggestions && searchTerm.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : suggestions.length > 0 ? (
                        <ul>
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion.word)}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                                >
                                    <div className="font-bold">{suggestion.word}</div>
                                    <div className="text-sm text-gray-600">{suggestion.roman}</div>
                                    {suggestion.definitions && suggestion.definitions[0] && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {suggestion.definitions[0].length > 70
                                                ? `${suggestion.definitions[0].substring(0, 70)}...`
                                                : suggestion.definitions[0]}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            No suggestions found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar; 