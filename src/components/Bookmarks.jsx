import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookmarks, removeBookmark } from '../services/bookmarkService';

/**
 * Bookmarks Component
 * Displays and manages bookmarked words
 */
const Bookmarks = () => {
    const { currentUser } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!currentUser) return;
            try {
                setLoading(true);
                const userBookmarks = await getUserBookmarks(currentUser.uid);
                setBookmarks(userBookmarks);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
                setError('Failed to load bookmarks');
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [currentUser]);

    const handleRemoveBookmark = async (wordId) => {
        if (!currentUser) return;
        try {
            await removeBookmark(currentUser.uid, wordId);
            setBookmarks(bookmarks.filter(bookmark => bookmark.wordId !== wordId));
        } catch (error) {
            console.error('Error removing bookmark:', error);
            setError('Failed to remove bookmark');
        }
    };

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
                <p className="text-gray-600 mb-4">
                    Sign in to access your bookmarked words
                </p>
                <Link
                    to="/login"
                    className="btn btn-primary"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-8">Bookmarked Words</h1>

            {bookmarks.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No bookmarked words yet</p>
                    <Link
                        to="/dictionary"
                        className="btn btn-primary"
                    >
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => (
                        <motion.div
                            key={bookmark.id}
                            className="card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold mb-2 urdu-text">
                                        {bookmark.word}
                                    </h2>
                                    <p className="text-gray-600 mb-2">{bookmark.roman}</p>
                                    <p className="text-gray-700">
                                        {bookmark.definition}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.wordId)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="Remove from bookmarks"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mt-4">
                                <Link
                                    to={`/word/${encodeURIComponent(bookmark.word)}`}
                                    className="btn btn-secondary"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Bookmarks;