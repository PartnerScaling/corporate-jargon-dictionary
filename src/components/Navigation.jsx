import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Star, BookOpen, Lightbulb } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Home className="nav-icon" />
        <span>Categories</span>
      </NavLink>
      <NavLink to="/creative" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Lightbulb className="nav-icon" />
        <span>Creative Collection</span>
      </NavLink>
      <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Star className="nav-icon" />
        <span>Favorites</span>
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <BookOpen className="nav-icon" />
        <span>About</span>
      </NavLink>
    </nav>
  );
};

export default Navigation; 