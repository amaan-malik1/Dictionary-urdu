import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWordDetails } from '../services/dictionaryService';

function Definition() {
    const { word } = useParams();
    const [wordDetails, setWordDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWordDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log('Fetching details for word:', word);
                const details = await getWordDetails(decodeURIComponent(word));
                
                if (details) {
                    console.log('Word details received:', details);
                    setWordDetails(details);
                } else {
                    setError('Word not found');
                }
            } catch (error) {
                console.error('Error fetching word:', error);
                setError('Error loading word details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (word) {
            fetchWordDetails();
        }
    }, [word]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (!wordDetails) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Word Not Found</h2>
                <p className="text-gray-600">
                    The word you're looking for doesn't exist in our dictionary.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="urdu-text">{wordDetails.word}</span>
                </h1>
                <p className="text-xl text-gray-600 mb-4">{wordDetails.roman}</p>

                <div className="space-y-6">
                    {wordDetails.definitions && wordDetails.definitions.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-3">Definitions</h2>
                            <ul className="list-disc list-inside space-y-2">
                                {wordDetails.definitions.map((def, index) => (
                                    <li key={index} className="text-gray-700 text-lg">{def}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {wordDetails.examples && wordDetails.examples.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default Definition; 