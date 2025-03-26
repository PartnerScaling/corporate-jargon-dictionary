import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { BookOpen, Star, Grid, Info, ListFilter, GamepadIcon } from 'lucide-react';
import { corporateJargonData } from './data/jargonData';
import Categories from './components/Categories';
import CorporateCreativityCollection from './components/CorporateCreativityCollection';
import JargonBingo from './components/JargonBingo';
import About from './components/About';
import AllPhrases from './components/AllPhrases';
import './App.css';

function App() {
  const [favorites, setFavorites] = useState([]);

  const handleToggleFavorite = (phrase) => {
    setFavorites(prevFavorites => {
      const exists = prevFavorites.some(f => f.phrase === phrase.phrase);
      if (exists) {
        return prevFavorites.filter(f => f.phrase !== phrase.phrase);
      } else {
        return [...prevFavorites, phrase];
      }
    });
  };

  const handleCopyPhrase = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="app">
      <nav className="navigation">
        <NavLink to="/all-phrases" className="nav-link" title="All Phrases">
          <ListFilter className="nav-icon" />
          <span>All Phrases</span>
        </NavLink>
        <NavLink to="/categories" className="nav-link" title="Categories">
          <Grid className="nav-icon" />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/bingo" className="nav-link" title="Non-sensical Bingo">
          <GamepadIcon className="nav-icon" />
          <span>Non-sensical</span>
        </NavLink>
        <NavLink to="/collection" className="nav-link" title="Collection">
          <BookOpen className="nav-icon" />
          <span>Collection</span>
        </NavLink>
        <NavLink to="/favorites" className="nav-link" title="Favorites">
          <Star className="nav-icon" />
          <span>Favorites</span>
        </NavLink>
        <NavLink to="/about" className="nav-link" title="About">
          <Info className="nav-icon" />
          <span>About</span>
        </NavLink>
      </nav>

      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <AllPhrases 
              data={corporateJargonData} 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhrase={handleCopyPhrase}
            />
          } />
          <Route path="/all-phrases" element={
            <AllPhrases 
              data={corporateJargonData} 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhrase={handleCopyPhrase}
            />
          } />
          <Route path="/categories" element={
            <Categories 
              data={corporateJargonData} 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhrase={handleCopyPhrase}
            />
          } />
          <Route path="/bingo" element={<JargonBingo data={corporateJargonData} />} />
          <Route path="/collection" element={<CorporateCreativityCollection />} />
          <Route path="/favorites" element={
            <Categories 
              data={favorites} 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhrase={handleCopyPhrase}
            />
          } />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 