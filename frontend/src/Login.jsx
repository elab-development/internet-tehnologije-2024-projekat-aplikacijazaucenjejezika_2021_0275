import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './App.css';

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      toast.success('Uspešno ste se prijavili!');
      navigate('/');
    } else {
      toast.error(data.message || 'Greška pri prijavi!');
    }
  };

  return (
    <div className="form-container">
      <h2>Prijava</h2>
      <form onSubmit={handleSubmit} className="form-content">
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
        <button type="submit" className="btn-submit">
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default Login;
