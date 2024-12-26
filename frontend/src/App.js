import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguagesPage from './LanguagesPage';
import LessonsPage from './LessonsPage';
import LekcijaPage from './LekcijaPage';
import TranslationPage from './TranslationPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      localStorage.removeItem('token');
      setToken(null);
      toast.info('Odjavili ste se.');
    });
  };

  return (
    <Router>
      
      <Navbar isLoggedIn={!!token} handleLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/translate" element={<TranslationPage />} />
        <Route path="/languages" element={<LanguagesPage />} />
        <Route path="/languages/:id/lessons" element={<LessonsPage />} />
        <Route path="/lekcija/:lessonId" element={<LekcijaPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
