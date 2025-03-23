import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GiArchiveResearch } from "react-icons/gi";
import { motion } from 'framer-motion';
import { getRecentWords, getWordSuggestions } from '../services/dictionaryService';
import WordOfDay from './WordOfDay';
import SearchBar from './SearchBar';

/**
 * Home Component
 * Landing page with search functionality and featured content
 */
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentWords, setRecentWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecentWords = async () => {
      try {
        const words = await getRecentWords(5);
        setRecentWords(words);
      } catch (error) {
        console.error('Error loading recent words:', error);
      }
    };

    loadRecentWords();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
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

  const handleSearch = (word) => {
    if (!word.trim()) return;
    navigate(`/word/${encodeURIComponent(word)}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

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

      <section className="word-of-day-section py-8">
        <div className="container">
          <WordOfDay />
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
    </div>
  );
};

export default Home;