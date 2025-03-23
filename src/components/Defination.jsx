import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaRegBookmark } from 'react-icons/fa'
import { getWordDetails } from '../services/dictionaryService'
import { useAuth } from '../contexts/AuthContext'
import { addBookmark, removeBookmark, isWordBookmarked } from '../services/bookmarkService'

/**
 * Definition Component
 * Displays detailed information about a specific word
 */
function Defination() {
    const { word } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const [wordDetails, setWordDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isBookmarked, setIsBookmarked] = useState(false)

    useEffect(() => {
        let isMounted = true;

        const fetchWordDetails = async () => {
            setLoading(true)
            setError(null)

            try {
                // Log auth state for debugging
                console.log('Auth state:', currentUser ? 'logged in' : 'not logged in');

                const details = await getWordDetails(decodeURIComponent(word))
                console.log('Fetched word details:', details)

                if (isMounted) {
                    if (details) {
                        setWordDetails(details)
                        if (currentUser) {
                            const bookmarked = await isWordBookmarked(currentUser.uid, details.id)
                            setIsBookmarked(bookmarked)
                        }
                    } else {
                        setError('Word not found')
                    }
                }
            } catch (error) {
                console.error('Error fetching word:', error)
                if (isMounted) {
                    setError('Error loading word details')
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchWordDetails()

        return () => {
            isMounted = false;
        }
    }, [word, currentUser])

    const toggleBookmark = async () => {
        if (!currentUser) {
            navigate('/login')
            return
        }

        try {
            if (isBookmarked) {
                await removeBookmark(currentUser.uid, wordDetails.id)
            } else {
                await addBookmark(currentUser.uid, wordDetails)
            }
            setIsBookmarked(!isBookmarked)
        } catch (error) {
            console.error('Error toggling bookmark:', error)
            setError('Failed to update bookmark')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-gray-600">
                    {error}
                </p>
            </motion.div>
        )
    }

    if (!wordDetails) {
        return (
            <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold mb-4">Word Not Found</h2>
                <p className="text-gray-600">
                    The word you're looking for doesn&apos;t exist in our dictionary.
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="urdu-text">{wordDetails.word}</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-2">{wordDetails.roman}</p>
                        <p className="text-gray-500">{wordDetails.pronunciation}</p>
                    </div>
                    <button
                        onClick={toggleBookmark}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 ${isBookmarked
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transition-colors`}
                    >
                        <FaRegBookmark className={`text-lg ${isBookmarked ? 'text-blue-600' : ''}`} />
                        {isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                    </button>
                </div>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold mb-3">Definitions</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {wordDetails.definitions.map((def, index) => (
                                <li key={index} className="text-gray-700 text-lg">{def}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">Examples</h2>
                        <ul className="space-y-2">
                            {wordDetails.examples.map((example, index) => (
                                <li key={index} className="text-gray-700 text-lg">
                                    <span className="urdu-text">{example}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {wordDetails.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-lg"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    )
}

export default Defination