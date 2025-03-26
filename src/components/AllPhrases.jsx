import React, { useState, useMemo } from 'react';
import { Star, Search, Copy, Share, Filter, X, BookOpen } from 'lucide-react';
import { corporateJargonData } from '../data/jargonData';

const AllPhrases = ({ data, favorites, onToggleFavorite, copiedPhrase, onCopyPhrase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [complexityRange, setComplexityRange] = useState([1, 10]);
  const [sortBy, setSortBy] = useState('alphabetical');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(data.map(phrase => phrase.category))];
    return ['all', ...cats.sort()];
  }, [data]);

  const handleCopy = (phrase) => {
    onCopyPhrase(phrase);
  };

  const handleShare = async (phrase) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Corporate Jargon Translation',
          text: `"${phrase.phrase}" means: ${phrase.translation}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
        handleCopy(phrase.phrase);
      }
    } else {
      handleCopy(`${phrase.phrase} - ${phrase.translation}`);
    }
  };

  const getComplexityLabel = (level) => {
    if (level >= 9) return "Ultra Non-sensical";
    if (level >= 7) return "Highly Non-sensical";
    if (level >= 5) return "Moderately Non-sensical";
    return "Basic";
  };

  const filteredAndSortedPhrases = useMemo(() => {
    let filtered = data.filter(phrase => {
      const matchesSearch = 
        phrase.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phrase.translation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory;
      
      const matchesComplexity = 
        phrase.bsLevel >= complexityRange[0] && 
        phrase.bsLevel <= complexityRange[1];

      return matchesSearch && matchesCategory && matchesComplexity;
    });

    switch (sortBy) {
      case 'alphabetical':
        return filtered.sort((a, b) => a.phrase.localeCompare(b.phrase));
      case 'complexity':
        return filtered.sort((a, b) => b.bsLevel - a.bsLevel);
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return filtered;
    }
  }, [data, searchTerm, selectedCategory, complexityRange, sortBy]);

  const isFavorite = (phrase) => {
    return favorites.some(fav => fav.phrase === phrase.phrase);
  };

  return (
    <div className="all-phrases-container">
      <div className="phrases-header">
        <h2 className="phrases-title">
          <BookOpen className="header-icon" />
          Corporate Jargon Dictionary
        </h2>
        <p className="phrases-subtitle">Decode the corporate speak with our comprehensive collection</p>
      </div>

      <div className="search-and-filter">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search phrases or meanings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Non-sensical Range</label>
            <div className="complexity-range">
              <input
                type="range"
                min="1"
                max="10"
                value={complexityRange[0]}
                onChange={(e) => setComplexityRange([Number(e.target.value), complexityRange[1]])}
                className="range-slider"
              />
              <input
                type="range"
                min="1"
                max="10"
                value={complexityRange[1]}
                onChange={(e) => setComplexityRange([complexityRange[0], Number(e.target.value)])}
                className="range-slider"
              />
              <div className="range-values">
                <span>NS Level: {complexityRange[0]} - {complexityRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <div className="sort-buttons">
              <button
                className={`sort-button ${sortBy === 'alphabetical' ? 'active' : ''}`}
                onClick={() => setSortBy('alphabetical')}
              >
                A-Z
              </button>
              <button
                className={`sort-button ${sortBy === 'complexity' ? 'active' : ''}`}
                onClick={() => setSortBy('complexity')}
              >
                NS Level
              </button>
              <button
                className={`sort-button ${sortBy === 'category' ? 'active' : ''}`}
                onClick={() => setSortBy('category')}
              >
                Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="results-info">
        Found {filteredAndSortedPhrases.length} phrases
        {searchTerm && ` matching "${searchTerm}"`}
        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
      </div>

      <div className="phrases-grid">
        {filteredAndSortedPhrases.map((phrase, index) => (
          <div key={index} className="phrase-card">
            <div className="phrase-header">
              <h3 className="phrase-title">{phrase.phrase}</h3>
            </div>

            <p className="phrase-translation">{phrase.translation}</p>

            <div className="phrase-footer">
              <div className="category-tag">{phrase.category}</div>
              <div className="action-buttons">
                <button
                  className={`action-button favorite-button ${isFavorite(phrase) ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(phrase)}
                  title={isFavorite(phrase) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star size={16} className={isFavorite(phrase) ? 'filled' : ''} />
                </button>
                <button
                  className="action-button copy-button"
                  onClick={() => handleCopy(phrase.phrase)}
                  title="Copy phrase"
                >
                  <Copy size={16} />
                </button>
                <button
                  className="action-button share-button"
                  onClick={() => handleShare(phrase)}
                  title="Share phrase"
                >
                  <Share size={16} />
                </button>
              </div>
            </div>

            {copiedPhrase === phrase.phrase && (
              <div className="copied-notification">Copied!</div>
            )}
          </div>
        ))}
      </div>

      {filteredAndSortedPhrases.length === 0 && (
        <div className="no-results">
          <p>No phrases found matching your criteria</p>
          <button 
            className="reset-filters"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setComplexityRange([1, 10]);
              setSortBy('alphabetical');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllPhrases; 