import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

// Mapa za čitljiva imena ruta
const segmentTitleMap = {
  '': 'Početna',
  'login': 'Prijava',
  'register': 'Registracija',
  'translate': 'Prevod',
  'languages': 'Jezici',
  'lessons': 'Lekcije',
  'lekcija': 'Lekcija',
};

const Breadcrumbs = () => {
  const location = useLocation();

  // Razbijanje pathname u segmente i uklanjanje praznih segmenata
  let pathSegments = location.pathname.split('/').filter(Boolean);

  // Ignorisanje segmenata koji su samo brojevi (ID-ovi)
  pathSegments = pathSegments.filter((segment) => !/^\d+$/.test(segment));

  return (
    <nav className="breadcrumbs">
      <ul>
        {/* Početna stranica (uvek prva) */}
        <li>
          <Link to="/">{segmentTitleMap[''] || 'Početna'}</Link>
        </li>

        {pathSegments.map((segment, index) => {
          const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          // Koristimo mapu za čitljiva imena ili prikazujemo segment direktno
          const segmentName = segmentTitleMap[segment] || decodeURIComponent(segment);

          return (
            <li key={url}>
              {!isLast ? (
                <>
                  <span className="separator">/</span>
                  <Link to={url}>{segmentName}</Link>
                </>
              ) : (
                <>
                  <span className="separator">/</span>
                  <span className="current">{segmentName}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
