import React, { useState, useMemo } from 'react';
import { Copy, Share, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { corporateJargonData } from '../data/jargonData';

const CorporateCreativityCollection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedPhrase, setCopiedPhrase] = useState(null);
  const itemsPerPage = 12;

  const filteredPhrases = useMemo(() => {
    return corporateJargonData
      .filter(phrase => phrase.bsLevel >= 7)
      .sort((a, b) => b.bsLevel - a.bsLevel);
  }, []);

  const totalPages = Math.ceil(filteredPhrases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePhrases = filteredPhrases.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    window.scrollTo(0, 0);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPhrase(text);
      setTimeout(() => setCopiedPhrase(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (phrase) => {
    const text = `${phrase.phrase}\nTranslation: ${phrase.translation || phrase.meaning}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        handleCopy(text);
      }
    } else {
      handleCopy(text);
    }
  };

  const renderPaginationButton = (pageNum, icon, label) => (
    <button
      onClick={() => handlePageChange(pageNum)}
      className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
      disabled={pageNum < 1 || pageNum > totalPages}
      aria-label={label}
    >
      {icon}
    </button>
  );

  return (
    <div className="corporate-creativity-section">
      <h2>Corporate Creativity Collection</h2>
      <p className="section-description">
        Explore our curated collection of the most creative corporate expressions, 
        ranked by their Complexity Index.
      </p>
      
      <div className="phrases-grid">
        {visiblePhrases.map((phrase, index) => (
          <div key={index} className="phrase-card">
            <div className="phrase-header">
              <h3>{phrase.phrase}</h3>
              <div className="complexity-level">Complexity Index: {phrase.bsLevel}</div>
            </div>
            <p className="phrase-meaning">{phrase.translation || phrase.meaning}</p>
            <div className="phrase-actions">
              <button
                onClick={() => handleCopy(phrase.phrase)}
                className="action-button"
                title="Copy phrase"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={() => handleShare(phrase)}
                className="action-button"
                title="Share phrase"
              >
                <Share size={18} />
              </button>
            </div>
            {copiedPhrase === phrase.phrase && (
              <div className="copied-notification">Copied!</div>
            )}
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <div className="pagination-controls">
          {renderPaginationButton(1, <ChevronsLeft size={20} />, "First page")}
          {renderPaginationButton(currentPage - 1, <ChevronLeft size={20} />, "Previous page")}
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {renderPaginationButton(currentPage + 1, <ChevronRight size={20} />, "Next page")}
          {renderPaginationButton(totalPages, <ChevronsRight size={20} />, "Last page")}
        </div>
        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default CorporateCreativityCollection; 