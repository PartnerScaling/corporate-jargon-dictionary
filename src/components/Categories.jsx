import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, Star } from 'react-feather';
import { toast } from 'react-toastify';
import { corporateJargonData } from '../data/jargonData';
import './Categories.css';

// Category descriptions and icons
const categoryMetadata = {
  'meetings': {
    icon: '🎪',
    description: 'Where time goes to die and souls go to get PowerPointed',
    color: '#FF7E6B'
  },
  'strategy': {
    icon: '🎯',
    description: 'Making simple things complex, and complex things incomprehensible',
    color: '#4CAF50'
  },
  'feedback': {
    icon: '🎭',
    description: 'The art of saying "you\'re terrible" in the nicest way possible',
    color: '#2196F3'
  },
  'management': {
    icon: '👔',
    description: 'Where common sense goes to fill out paperwork in triplicate',
    color: '#9C27B0'
  },
  'tech': {
    icon: '🤖',
    description: 'Because "turning it off and on again" needed a fancier name',
    color: '#00BCD4'
  },
  'productivity': {
    icon: '⚡',
    description: 'Doing more things poorly instead of one thing well',
    color: '#FF9800'
  },
  'problems': {
    icon: '🔥',
    description: 'Creative ways to say "everything\'s on fire" while smiling',
    color: '#F44336'
  },
  'ceo': {
    icon: '👑',
    description: 'Visionary ways to say absolutely nothing of substance',
    color: '#673AB7'
  },
  'finance': {
    icon: '💸',
    description: 'Making money disappear through "strategic initiatives"',
    color: '#009688'
  },
  'marketing': {
    icon: '🎨',
    description: 'The art of making promises Engineering has to keep',
    color: '#E91E63'
  },
  'sales': {
    icon: '🎭',
    description: 'Professional relationship stalkers with quarterly targets',
    color: '#795548'
  },
  'remote': {
    icon: '🏠',
    description: 'Where pants are optional but webcams are mandatory',
    color: '#607D8B'
  },
  'startup': {
    icon: '🚀',
    description: 'Burning investor money with style and ping pong tables',
    color: '#FFC107'
  },
  'consultant': {
    icon: '💼',
    description: 'Stating the obvious at premium hourly rates',
    color: '#9E9E9E'
  },
  'hr': {
    icon: '🤝',
    description: 'Making mandatory fun sound like a perk',
    color: '#8BC34A'
  },
  'intern': {
    icon: '🎓',
    description: 'Professional coffee fetchers with fancy titles',
    color: '#FF5722'
  },
  'product': {
    icon: '📱',
    description: 'Making PowerPoints about features we\'ll never build',
    color: '#3F51B5'
  },
  'engineer': {
    icon: '💻',
    description: 'Turning coffee into code and bugs into features',
    color: '#2196F3'
  },
  'designer': {
    icon: '🎨',
    description: 'Making things pretty while ignoring functionality',
    color: '#FF4081'
  },
  'data': {
    icon: '📊',
    description: 'Making up stories about numbers',
    color: '#00BCD4'
  },
  'project': {
    icon: '📋',
    description: 'Corporate speak at its finest',
    color: '#FF6B6B'
  }
};

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [copiedPhrase, setCopiedPhrase] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Group phrases by category
  const categories = corporateJargonData.reduce((acc, phrase) => {
    if (!acc[phrase.category]) {
      acc[phrase.category] = [];
    }
    acc[phrase.category].push(phrase);
    return acc;
  }, {});

  const handleCopyPhrase = (phrase) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
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
        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      handleCopyPhrase(phrase);
    }
  };

  const toggleFavorite = (phrase) => {
    setFavorites(prev => {
      const isFavorited = prev.some(p => p.phrase === phrase.phrase);
      if (isFavorited) {
        toast.info('Removed from favorites');
        return prev.filter(p => p.phrase !== phrase.phrase);
      } else {
        toast.success('Added to favorites');
        return [...prev, phrase];
      }
    });
  };

  const isFavorite = (phrase) => {
    return favorites.some(p => p.phrase === phrase.phrase);
  };

  if (!selectedCategory) {
    return (
      <div className="categories-container">
        <div className="categories-header">
          <h1 className="categories-title">Corporate Jargon Categories</h1>
          <p className="categories-subtitle">Your guide to speaking corporate, because plain English is too mainstream</p>
        </div>
        
        <div className="categories-grid">
          {Object.entries(categories).map(([category, phrases]) => {
            const metadata = categoryMetadata[category] || {};
            return (
              <div
                key={category}
                className="category-card"
                onClick={() => setSelectedCategory(category)}
                style={{
                  borderColor: metadata.color || '#ddd',
                  background: `linear-gradient(45deg, ${metadata.color}11, ${metadata.color}22)`
                }}
              >
                <div className="category-header">
                  <span className="category-emoji" style={{ fontSize: '2rem' }}>
                    {metadata.icon || '💼'}
                  </span>
                  <h2 className="category-title">{category}</h2>
                </div>
                
                <div className="category-count">
                  {phrases.length} {phrases.length === 1 ? 'phrase' : 'phrases'}
                </div>
                
                <p className="category-description">
                  {metadata.description || 'Corporate speak at its finest'}
                </p>

                <div className="category-footer">
                  <span className="explore-text">Click to explore →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const categoryPhrases = categories[selectedCategory] || [];
  const metadata = categoryMetadata[selectedCategory] || {};

  return (
    <div className="categories-container">
      <button className="back-button" onClick={() => setSelectedCategory(null)}>
        <ArrowLeft size={20} />
        Back to Categories
      </button>

      <div className="category-header-large" style={{ borderColor: metadata.color }}>
        <span className="category-emoji">
          {metadata.icon || '💼'}
        </span>
        <div className="category-header-content">
          <h2>{selectedCategory}</h2>
          <p className="category-description-large">
            {metadata.description}
          </p>
        </div>
        <span className="phrase-count" style={{ backgroundColor: metadata.color }}>
          {categoryPhrases.length} phrases
        </span>
      </div>

      <div className="phrases-grid">
        {categoryPhrases.map((phrase) => (
          <div 
            key={phrase.id || phrase.phrase} 
            className="phrase-card"
            style={{ borderColor: `${metadata.color}44` }}
          >
            <div className="phrase-content">
              <h3 className="phrase-text">{phrase.phrase}</h3>
              <p className="phrase-meaning">{phrase.translation || phrase.meaning}</p>
            </div>
            <div className="card-actions">
              <button
                className={`action-button favorite ${isFavorite(phrase) ? 'active' : ''}`}
                onClick={() => toggleFavorite(phrase)}
                data-label="Favorite"
              >
                <Star size={18} />
              </button>
              <button
                className="action-button"
                onClick={() => handleCopyPhrase(phrase.phrase)}
                data-label="Copy"
              >
                <Copy size={18} />
              </button>
              <button
                className="action-button"
                onClick={() => handleSharePhrase(phrase.phrase)}
                data-label="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 