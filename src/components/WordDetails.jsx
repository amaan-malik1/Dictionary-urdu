import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWordDetails } from '../services/dictionaryService';

function WordDetails() {
    const { id } = useParams();
    const [word, setWord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWord = async () => {
            try {
                const details = await getWordDetails(id);
                setWord(details);
            } catch (error) {
                console.error('Error fetching word:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWord();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!word) return <div>Word not found</div>;

    return (
        <div className="word-details">
            <h2>{word.word}</h2>
            <p className="roman">{word.roman}</p>
            {word.definitions && (
                <div className="definitions">
                    <h3>Definitions:</h3>
                    <ul>
                        {word.definitions.map((def, index) => (
                            <li key={index}>{def}</li>
                        ))}
                    </ul>
                </div>
            )}
            {word.examples && word.examples.length > 0 && (
                <div className="examples">
                    <h3>Examples:</h3>
                    <ul>
                        {word.examples.map((example, index) => (
                            <li key={index}>{example}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default WordDetails; 