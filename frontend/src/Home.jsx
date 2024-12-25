import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">Učite jezik uz interaktivne lekcije</h1>
          <p className="hero-subtitle">Iskoristite različite načine učenja, audio materijale i dinamične kvizove kako bi usavršili svoje znanje.</p>
          <button className="cta-button">Počnite odmah</button>
        </div>
      </header>

      



      <footer className="footer-section">
        <p>© 2024 Aplikacija za učenje jezika</p>
      </footer>
    </div>
  );
};

export default Home;
