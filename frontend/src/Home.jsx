import React from 'react';
import {useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/languages');
  };


  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">Učite jezik uz interaktivne lekcije</h1>
          <p className="hero-subtitle">Iskoristite različite načine učenja, audio materijale i dinamične kvizove kako bi usavršili svoje znanje.</p>
          <button className="cta-button" onClick={handleRedirect}>Počnite odmah</button>
        </div>
      </header>


      <footer className="footer-section">
        <p>© 2024 Aplikacija za učenje jezika</p>
      </footer>
    </div>
  );
};

export default Home;
