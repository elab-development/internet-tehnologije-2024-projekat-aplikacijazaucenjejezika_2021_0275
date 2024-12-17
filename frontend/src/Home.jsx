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

      <section className="features-section">
        <h2 className="section-title">Raznovrsne funkcionalnosti</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img className="feature-icon" src="https://via.placeholder.com/100" alt="Audio ikona" />
            <h3>Audio Učenje</h3>
            <p>Slušaj audio fajlove i prepoznaj reči. Pomaže ti da treniraš sluh i razumevanje.</p>
          </div>
          <div className="feature-card">
            <img className="feature-icon" src="https://via.placeholder.com/100" alt="Kviz ikona" />
            <h3>Interaktivni Kvizovi</h3>
            <p>Testiraj svoje znanje uz bogate, interaktivne zadatke i proveri svoj napredak.</p>
          </div>
          <div className="feature-card">
            <img className="feature-icon" src="https://via.placeholder.com/100" alt="Pisanje ikona" />
            <h3>Vežbe Pisanja</h3>
            <p>Unapredi svoje jezičke veštine kroz pisanje i automatsku proveru rečenica.</p>
          </div>
          <div className="feature-card">
            <img className="feature-icon" src="https://via.placeholder.com/100" alt="Gramatika ikona" />
            <h3>Gramatika i Vokabular</h3>
            <p>Nauči nove reči i gramatiku kroz interaktivne vežbe i kontekstualne primere.</p>
          </div>
        </div>
      </section>

      <section className="duolingo-section">
        <h2 className="section-title">Inspiriši se poznatim aplikacijama</h2>
        <p>Za primer može poslužiti Duolingo, popularna aplikacija za učenje jezika koja kombinuje audio, vizuelne elemente i interaktivne zadatke.</p>
        <img className="inspiration-image" src="https://via.placeholder.com/300x200" alt="Duolingo inspiracija" />
      </section>

      <footer className="footer-section">
        <p>© 2024 Aplikacija za učenje jezika</p>
      </footer>
    </div>
  );
};

export default Home;
