import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import './Navbar.css';
import Breadcrumbs from './Breadcrumbs';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const role = localStorage.getItem('role');

  const logoutAndRedirect = () => {
    handleLogout(); 
    navigate('/'); 
  };
  
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <GrLanguage className="App-logo" size={40} color="#61dafb" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Početna</Link>
          </li>

          {isLoggedIn ? (
            <>
            {role !== "admin" && (
                <>
                  <li>
                    <Link to="/translate">Prevod</Link>
                  </li>
                  <li>
                    <Link to="/languages">Jezici</Link>
                  </li>
                </>
              )}
              {role === "admin" && (
                <>
                <li>
                  <Link to="/adminPage">Admin page</Link>
                </li>
                <li>
                  <Link to="/statistics">Statistike</Link>
                </li>
                </>
              )}
              <li>
                <button onClick={logoutAndRedirect} className="logout-btn">
                  Odjavi se
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Breadcrumbs />
    </div>
    
  );
};

export default Navbar;