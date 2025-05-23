import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './components/forms/RegistrationForm';
import HomePage from './components/pages/HomePage';
import Toastr from './components/toastr/Toastr';
import './App.css';

/**
 * The main application component that handles routing and authentication state.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  const [successful, setSuccessful] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  const handleLoginSuccess = (token, role, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestion des utilisateurs</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? 
                <Navigate to="/home" /> : 
                <RegistrationForm setSuccessful={setSuccessful} onLoginSuccess={handleLoginSuccess} />
            } />
            <Route 
              path="/home" 
              element={
                isAuthenticated ? 
                  <HomePage userRole={userRole} userEmail={userEmail} /> : 
                  <Navigate to="/" />
              } 
            />
          </Routes>
          {successful && <Toastr setSuccessful={setSuccessful} />}
        </main>
      </div>
    </Router>
  );
}

export default App;
