import React, { useState, useMemo } from 'react';
import { Star, Trash2, Copy, Share2, Sparkles, Search, Facebook, Twitter, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites = ({ favorites, onRemoveFavorite, onCopyPhrase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'bsLevel', 'alpha'
  const [filterBsLevel, setFilterBsLevel] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    onCopyPhrase(text);
  };

  const handleShare = async (phrase, platform) => {
    const text = `${phrase.phrase} - ${phrase.meaning}`;
    const url = window.location.href;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodeURIComponent(text)}`);
        break;
      default:
        handleCopy(text);
    }
  };

  const filteredAndSortedFavorites = useMemo(() => {
    let result = [...(favorites || [])];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(phrase => 
        phrase.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phrase.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply Complexity Level filter
    if (filterBsLevel !== 'all') {
      result = result.filter(phrase => phrase.bsLevel === parseInt(filterBsLevel));
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(phrase => phrase.category === filterCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'bsLevel':
        result.sort((a, b) => b.bsLevel - a.bsLevel);
        break;
      case 'alpha':
        result.sort((a, b) => a.phrase.localeCompare(b.phrase));
        break;
      case 'date':
      default:
        // Assuming newest first, using array order
        break;
    }

    return result;
  }, [favorites, searchTerm, sortBy, filterBsLevel, filterCategory]);

  const categories = useMemo(() => {
    return ['all', ...new Set(favorites?.map(phrase => phrase.category) || [])];
  }, [favorites]);

  const bsLevels = useMemo(() => {
    return ['all', ...new Set(favorites?.map(phrase => phrase.bsLevel.toString()) || [])];
  }, [favorites]);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-container">
        <div className="favorites-header">
          <h1 className="favorites-title">
            <Star className="w-8 h-8 text-yellow-500" />
            Favorite Phrases
          </h1>
        </div>
        <div className="empty-favorites">
          <Star className="empty-favorites-icon" />
          <p className="empty-favorites-text">No favorite phrases yet!</p>
          <p className="text-gray-500">Start adding phrases you want to remember.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">
          <Star className="w-8 h-8 text-yellow-500" />
          Favorite Phrases
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
        </h1>
        <p className="text-gray-600 mb-6">Your saved corporate jargon translations</p>
      </div>

      <div className="filters-container mb-6">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="bsLevel">Sort by Complexity Index</option>
            <option value="alpha">Sort Alphabetically</option>
          </select>

          <select
            value={filterBsLevel}
            onChange={(e) => setFilterBsLevel(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Complexity Levels</option>
            {bsLevels.map(level => level !== 'all' && (
              <option key={level} value={level}>Complexity Index {level}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => category !== 'all' && (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        <motion.div 
          className="favorites-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredAndSortedFavorites.map((phrase, index) => (
            <motion.div
              key={index}
              className="favorite-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="favorite-category">{phrase.category}</span>
              <div className="favorite-phrase">{phrase.phrase}</div>
              <div className="favorite-meaning">{phrase.meaning}</div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="bs-level-indicator">
                  Complexity Index: {phrase.bsLevel}/10
                </span>
                <div className="flex gap-2">
                  <button
                    className="favorite-button"
                    onClick={() => handleCopy(phrase.phrase)}
                    title="Copy phrase"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    className="favorite-button"
                    onClick={() => onRemoveFavorite(phrase)}
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="share-dropdown">
                    <button className="favorite-button" title="Share">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <div className="share-options">
                      <button onClick={() => handleShare(phrase, 'facebook')}>
                        <Facebook className="w-4 h-4" /> Facebook
                      </button>
                      <button onClick={() => handleShare(phrase, 'twitter')}>
                        <Twitter className="w-4 h-4" /> Twitter
                      </button>
                      <button onClick={() => handleShare(phrase, 'linkedin')}>
                        <Link2 className="w-4 h-4" /> LinkedIn
                      </button>
                      <button onClick={() => handleShare(phrase, 'copy')}>
                        <Link2 className="w-4 h-4" /> Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Favorites; 