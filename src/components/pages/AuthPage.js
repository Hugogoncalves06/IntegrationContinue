import React, { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import RegistrationForm from '../forms/RegistrationForm';
import './AuthPage.css';

const AuthPage = ({ setSuccessful, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Journal des Citoyens</h1>
        <div className="auth-tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            data-testid="tab-connexion"
          >
            Connexion
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            data-testid="tab-inscription"
          >
            Inscription
          </button>
        </div>
      </div>
      
      {isLogin ? (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <RegistrationForm setSuccessful={setSuccessful} onLoginSuccess={onLoginSuccess} />
      )}
    </div>
  );
};

export default AuthPage;
