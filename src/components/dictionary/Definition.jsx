import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getWordDetails } from '../../services/dictionary/wordService';

function Definition() {
    const { word } = useParams();
    const [wordDetails, setWordDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWordDetails = async () => {
            try {
                const details = await getWordDetails(word);
                setWordDetails(details);
            } catch (error) {
                console.error('Error fetching word details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWordDetails();
    }, [word]);

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
}

export default Definition; 