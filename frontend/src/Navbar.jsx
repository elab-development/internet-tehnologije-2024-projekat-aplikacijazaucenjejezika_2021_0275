import React from 'react';
import { Link } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import './Navbar.css';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <GrLanguage className="App-logo" size={40} color="#61dafb" />
      </div>
      <ul className="nav-links">
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Odjavi se
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
