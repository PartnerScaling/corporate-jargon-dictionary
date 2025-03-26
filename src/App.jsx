import React, { useState } from 'react';
import { Star, BookOpen, Home, Grid, Info, AlertTriangle } from 'lucide-react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { corporateJargonData } from './data/jargonData.js';
import './App.css';

// Components
import AllPhrases from './components/AllPhrases';
import JargonBingo from './components/JargonBingo';
import Favorites from './components/Favorites';
import Categories from './components/Categories';
import About from './components/About';
import MostNonsensical from './components/MostNonsensical';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [copiedPhrase, setCopiedPhrase] = useState(null);

  const handleToggleFavorite = (phrase) => {
    setFavorites(prevFavorites => {
      const exists = prevFavorites.some(p => p.phrase === phrase.phrase);
      if (exists) {
        return prevFavorites.filter(p => p.phrase !== phrase.phrase);
      } else {
        return [...prevFavorites, {
          phrase: phrase.phrase,
          meaning: phrase.translation || phrase.meaning,
          category: phrase.category,
          bsLevel: phrase.bsLevel
        }];
      }
    });
  };

  const handleCopyPhrase = (text) => {
    setCopiedPhrase(text);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  return (
    <div className="app">
      <nav className="nav-bar">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <Home className="nav-icon" />
          All Phrases
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
          <Grid className="nav-icon" />
          Categories
        </NavLink>
        <NavLink to="/nonsensical" className={({ isActive }) => isActive ? 'active' : ''}>
          <AlertTriangle className="nav-icon" />
          Most Non-Sensical
        </NavLink>
        <NavLink to="/bingo" className={({ isActive }) => isActive ? 'active' : ''}>
          <Star className="nav-icon" />
          Jargon Bingo
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
          <BookOpen className="nav-icon" />
          Favorites
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          <Info className="nav-icon" />
          About
        </NavLink>
      </nav>

      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <AllPhrases 
                data={corporateJargonData}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                copiedPhrase={copiedPhrase}
                onCopyPhrase={handleCopyPhrase}
              />
            } 
          />
          <Route 
            path="/categories" 
            element={
              <Categories 
                data={corporateJargonData}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onCopyPhrase={handleCopyPhrase}
              />
            }
          />
          <Route 
            path="/nonsensical" 
            element={
              <MostNonsensical 
                data={corporateJargonData}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                copiedPhrase={copiedPhrase}
                onCopyPhrase={handleCopyPhrase}
              />
            }
          />
          <Route path="/bingo" element={<JargonBingo data={corporateJargonData} />} />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                favorites={favorites}
                onRemoveFavorite={handleToggleFavorite}
                onCopyPhrase={handleCopyPhrase}
              />
            } 
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;