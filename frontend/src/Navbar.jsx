import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>Moja Aplikacija</h1>
      <div>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.logoutBtn}>Odjavi se</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#007bff', color: '#fff' },
  title: { margin: 0 },
  link: { margin: '0 10px', textDecoration: 'none', color: '#fff', fontSize: '16px' },
  logoutBtn: { padding: '5px 10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer' }
};

export default Navbar;
