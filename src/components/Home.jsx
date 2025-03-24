import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { getRecentWords } from '../services/dictionaryService';

/**
 * Home Component
 * Landing page with search functionality and featured content
 */
const Home = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const loadRecentWords = async () => {
      const recentWords = await getRecentWords();
      setWords(recentWords);
    };
    loadRecentWords();
  }, []);

  return (
    <div className="home">
      <section className="hero-section">
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="urdu-text">اردو لغت</span>
            <br />
            <span className="text-primary-color">Urdu Dictionary</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the beauty of Urdu language
          </p>
          <Link
            to="/dictionary"
            className="btn btn-primary text-lg px-8 py-3"
          >
            Start Searching
          </Link>
        </motion.div>
      </section>

      <section className="features-section py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Comprehensive Dictionary</h3>
              <p className="text-gray-600">
                Search through thousands of Urdu words with detailed meanings and examples.
              </p>
            </motion.div>

            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">Bookmark Words</h3>
              <p className="text-gray-600">
                Save your favorite words for quick access and future reference.
              </p>
            </motion.div>

            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4">Learn Daily</h3>
              <p className="text-gray-600">
                Discover a new word every day to expand your Urdu vocabulary.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.div
        className="max-w-4xl mx-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Urdu Dictionary</h1>
          <p className="text-gray-600">Search for Urdu words and their meanings</p>
        </div>

        <SearchBar />
      </motion.div>

      {words.length > 0 && (
        <div className="recent-words">
          <h2>Recent Words</h2>
          <ul>
            {words.map(word => (
              <li key={word.id}>
                <Link to={`/word/${word.id}`}>
                  {word.word} - {word.roman}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;