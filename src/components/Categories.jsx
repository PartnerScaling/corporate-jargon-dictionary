import React, { useState } from 'react';
import { ArrowLeft, Copy, Share2 } from 'react-feather';
import { toast } from 'react-toastify';

const Categories = ({ data = [], favorites = [], onToggleFavorite = () => {}, onCopyPhrase = () => {} }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [copiedPhrase, setCopiedPhrase] = useState(null);

  // Get unique categories and their counts
  const categories = (data || []).reduce((acc, item) => {
    const category = acc[item.category] || { count: 0, emoji: item.emoji || '📝', phrases: [] };
    category.count++;
    category.phrases.push(item);
    acc[item.category] = category;
    return acc;
  }, {});

  const handleCopyPhrase = (phrase) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    onCopyPhrase(phrase);
    toast.success('Phrase copied to clipboard!');
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const handleSharePhrase = async (phrase) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Corporate Jargon',
          text: phrase,
        });
        toast.success('Phrase shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share phrase');
        }
      }
    } else {
      handleCopyPhrase(phrase);
    }
  };

  const getCategoryEmoji = (category) => {
    return categories[category]?.emoji || '📝';
  };

  if (!selectedCategory) {
    return (
      <div className="categories-container">
        <div className="categories-header">
          <h1 className="categories-title">Browse by Category</h1>
          <p className="categories-subtitle">Explore corporate jargon phrases organized by category</p>
        </div>
        
        <div className="categories-nav">
          {Object.entries(categories).map(([category, { count, emoji }]) => (
            <button
              key={category}
              className="category-nav-item"
              onClick={() => setSelectedCategory(category)}
            >
              <span className="category-emoji">{emoji}</span>
              <span>{category}</span>
              <span className="phrase-count">{count}</span>
            </button>
          ))}
        </div>

        <div className="categories-grid">
          {Object.entries(categories).map(([category, { count, emoji, phrases }]) => (
            <div
              key={category}
              className="category-card"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="category-header">
                <span className="category-emoji">{emoji}</span>
                <h3 className="category-title">{category}</h3>
              </div>
              <div className="category-count">{count} phrases</div>
              <div className="top-phrases">
                {phrases.slice(0, 3).map((phrase) => (
                  <div key={phrase.phrase} className="top-phrase">
                    <p className="phrase-text">{phrase.phrase}</p>
                    <div className="ns-level">
                      <span>NS Level:</span>
                      <span>{phrase.bsLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const categoryPhrases = data.filter(phrase => phrase.category === selectedCategory);

  return (
    <div className="categories-container">
      <button className="back-button" onClick={() => setSelectedCategory(null)}>
        <ArrowLeft size={20} />
        Back to Categories
      </button>

      <div className="category-header-large">
        <span className="category-emoji">{getCategoryEmoji(selectedCategory)}</span>
        <h2>{selectedCategory}</h2>
        <span className="phrase-count">{categoryPhrases.length} phrases</span>
      </div>

      <div className="categories-grid">
        {categoryPhrases.map((phrase) => (
          <div key={phrase.phrase} className="category-card">
            <p className="phrase-text">{phrase.phrase}</p>
            <div className="ns-level">
              <span>NS Level:</span>
              <span>{phrase.bsLevel}</span>
            </div>
            <div className="card-actions">
              <button
                className={`action-button ${copiedPhrase === phrase.phrase ? 'copied' : ''}`}
                onClick={() => handleCopyPhrase(phrase.phrase)}
              >
                <Copy size={18} />
                {copiedPhrase === phrase.phrase ? 'Copied!' : 'Copy'}
              </button>
              <button
                className="action-button"
                onClick={() => handleSharePhrase(phrase.phrase)}
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 