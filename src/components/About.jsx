import React from 'react';
import { Coffee, Github, Twitter } from 'lucide-react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Corporate Jargon Translator</h1>
        <p className="subtitle">Decoding the corporate speak, one phrase at a time 🎯</p>
      </div>

      <div className="about-section">
        <h2>What is this?</h2>
        <p>
          Corporate Jargon Translator is your go-to tool for decoding and understanding corporate buzzwords 
          and business speak. Whether you're a newcomer to the corporate world or a seasoned professional, 
          this app helps you navigate the sometimes absurd world of business jargon.
        </p>
      </div>

      <div className="about-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔍 Phrase Library</h3>
            <p>Browse through hundreds of common corporate phrases and their plain English translations.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Complexity Index</h3>
            <p>Each phrase comes with a "Complexity Index" indicator showing how unnecessarily complex or jargony it is.</p>
          </div>
          <div className="feature-card">
            <h3>🎲 Jargon Bingo</h3>
            <p>Play bingo during your next meeting! Mark off phrases as you hear them.</p>
          </div>
          <div className="feature-card">
            <h3>⭐ Favorites</h3>
            <p>Save your favorite (or most dreaded) phrases for quick reference.</p>
          </div>
          <div className="feature-card">
            <h3>🗂️ Categories</h3>
            <p>Browse phrases by category, from "Management Speak" to "Tech Buzzwords".</p>
          </div>
          <div className="feature-card">
            <h3>📱 Mobile Friendly</h3>
            <p>Use it on any device during meetings or casual conversations.</p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>How to Use</h2>
        <ol className="usage-steps">
          <li>Browse through the phrase library or search for specific terms</li>
          <li>Click on phrases to see their plain English translations</li>
          <li>Save your favorites for quick access</li>
          <li>Use the Jargon Bingo feature during meetings</li>
          <li>Explore different categories to learn domain-specific jargon</li>
        </ol>
      </div>

      <div className="about-section">
        <h2>Support the Project</h2>
        <div className="support-options">
          <a href="https://github.com/yourusername/corporate-jargon-translator" className="support-link">
            <Github className="support-icon" />
            Star on GitHub
          </a>
          <a href="https://twitter.com/share" className="support-link">
            <Twitter className="support-icon" />
            Share on Twitter
          </a>
          <a href="https://ko-fi.com/yourusername" className="support-link">
            <Coffee className="support-icon" />
            Buy me a coffee
          </a>
        </div>
      </div>

      <footer className="about-footer">
        <p>Made with 💼 and a healthy dose of sarcasm</p>
        <p>© 2024 Corporate Jargon Translator</p>
      </footer>
    </div>
  );
};

export default About; 