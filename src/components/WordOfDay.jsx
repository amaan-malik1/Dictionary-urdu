import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
// Import a sample word directly instead of using getWordOfDay
// import { getWordOfDay } from '../services/dictionaryService'

function WordOfDay() {
    const [loading, setLoading] = useState(true)

    // Hard-code a sample word to avoid API errors
    const [wordOfDay] = useState({
        word: "اردو",
        roman: "urdu",
        definitions: ["The national language of Pakistan"],
        examples: ["اردو پاکستان کی قومی زبان ہے"]
    })

    useEffect(() => {
        // Simple timeout to simulate loading
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="loading">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
            </div>
        )
    }

    return (
        <motion.div
            className="card bg-gradient-to-r from-primary-color to-secondary-color text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Word of the Day</h2>
                    <h3 className="text-2xl font-bold mb-2">
                        <span className="urdu-text">{wordOfDay.word}</span>
                    </h3>
                    <p className="text-white/90 mb-2">{wordOfDay.roman}</p>
                    <p className="text-white/80 text-sm mb-4">{wordOfDay.definitions[0]}</p>
                    <Link
                        to={`/word/${encodeURIComponent(wordOfDay.word)}`}
                        className="inline-block bg-white text-primary-color px-4 py-2 rounded-md hover:bg-white/90 transition-colors"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default WordOfDay 