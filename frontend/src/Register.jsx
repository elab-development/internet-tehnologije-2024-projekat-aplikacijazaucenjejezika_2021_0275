import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './App.css';

const Register = ({ setToken }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      toast.success('Registracija je uspešna!');
      navigate('/');
    } else {
      toast.error('Greška pri registraciji!');
    }
  };

  return (
    <div className="form-container">
      <h2>Registracija</h2>
      <form onSubmit={handleSubmit} className="form-content">
        <input
          type="text"
          name="name"
          placeholder="Ime"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Potvrdi lozinku"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-submit">
          Registruj se
        </button>
      </form>
    </div>
  );
};

export default Register;
