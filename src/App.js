import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import AuthPage from './components/pages/AuthPage';
import Toastr from './components/toastr/Toastr';
import UserDetailPage from './components/pages/UserDetailPage';
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
    <Router basename="/">
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={
              isAuthenticated ? 
                <Navigate to="/home" /> : 
                <AuthPage setSuccessful={setSuccessful} onLoginSuccess={handleLoginSuccess} />
            } />
            <Route 
              path="/home" 
              element={
                isAuthenticated ? 
                  <HomePage 
                    userRole={userRole} 
                    userEmail={userEmail} 
                    onLogout={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('userRole');
                      localStorage.removeItem('userEmail');
                      setIsAuthenticated(false);
                      setUserRole(null);
                      setUserEmail(null);
                    }}
                    data-testid="home-page"
                  /> : 
                  <Navigate to="/login" />
              }
            />
            <Route path="/user/:id" element={<UserDetailPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          {successful && <Toastr setSuccessful={setSuccessful} />}
        </main>
      </div>
    </Router>
  );
}

export default App;
