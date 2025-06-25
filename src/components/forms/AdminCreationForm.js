import React, { useState } from 'react';
import axios from 'axios';
import { isValidEmail } from '../utils/validation';
import './AdminCreationForm.css';

const initialState = {
  email: '',
  password: '',
  role: 'admin',
};

const passwordRules = [
  { label: 'Au moins 8 caractères', test: v => v.length >= 8 },
  { label: 'Au moins une majuscule', test: v => /[A-Z]/.test(v) },
  { label: 'Au moins un chiffre', test: v => /\d/.test(v) },
];

export default function AdminCreationForm({ onSuccess, onClose }) {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    if (name === 'email') {
      if (!isValidEmail(value)) {
        setEmailError("L'email n'est pas valide");
      } else {
        setEmailError('');
      }
    }
    if (name === 'password') {
      if (!value || passwordRules.some(rule => !rule.test(value))) {
        setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.REACT_APP_PYTHON_API}/admins`, form, {
        headers: { Authorization: `${localStorage.getItem('token')}` },
      });
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = passwordRules.every(rule => rule.test(form.password));
  const emailValid = isValidEmail(form.email);
  const canSubmit = passwordValid && emailValid && !loading && !emailError && !passwordError;

  return (
    <form className="admin-creation-form" onSubmit={handleSubmit} data-testid="admin-creation-form">
      <h3>Créer un administrateur</h3>
      <div className="form-group">
        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          data-testid="admin-email"
          className={emailError ? 'error' : ''}
        />
        {emailError && <span className="error-message" data-testid="admin-email-error" style={{ minHeight: 20, display: 'block' }}>{emailError}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="admin-password">Mot de passe</label>
        <div style={{ position: 'relative' }}>
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            data-testid="admin-password"
          />
          <span
            onClick={() => setShowPassword(v => !v)}
            style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}
            data-testid="toggle-admin-password"
            title={showPassword ? 'Cacher' : 'Afficher'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <ul className="password-rules">
          {passwordRules.map(rule => (
            <li key={rule.label} style={{ color: rule.test(form.password) ? 'green' : 'red' }}>
              {rule.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <label htmlFor="admin-role">Rôle</label>
        <select id="admin-role" name="role" value={form.role} onChange={handleChange} data-testid="admin-role">
          <option value="admin">admin</option>
        </select>
      </div>
      {error && <div className="error-message" data-testid="admin-error">{error}</div>}
      <button type="submit" disabled={!canSubmit} data-testid="admin-submit">
        Créer
      </button>
      {onClose && <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Annuler</button>}
    </form>
  );
}
