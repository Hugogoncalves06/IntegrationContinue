import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_PYTHON_API}/login`, formData);
      const { token, email, role } = response.data;
      onLoginSuccess(token, role, email);
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" data-testid="login-form">
      <h2 data-testid="login-title">Connexion</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="input-email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          data-testid="input-password"
        />
      </div>

      {error && <div className="error-message" data-testid="login-error">{error}</div>}

      <button type="submit" data-testid="login-submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
