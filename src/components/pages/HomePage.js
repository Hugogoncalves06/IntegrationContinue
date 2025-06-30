import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminCreationForm from '../forms/AdminCreationForm';

const HomePage = ({ userRole, userEmail, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_PYTHON_API}/users`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_PYTHON_API}/users/${userId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      fetchUsers();
      window.location.reload();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="loading" data-testid="loading-message">Chargement de la gazette...</div>;
  if (error) return <div className="error-message" data-testid="error-message">{error}</div>;

  const isAdmin = userRole === 'admin';
  const currentUserData = users.find(user => user.email === userEmail);

  return (
    <div className="home-page" data-testid="home-page">
        <button
        data-testid="logout-btn"
          className="logout-btn"
        style={{ position: 'absolute', top: 20, right: 20 }}
        onClick={() => {
          if (typeof onLogout === 'function') {
            onLogout();
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            navigate('/login');
          }
        }}
        >
          Déconnexion
        </button>
      <h2 data-testid="page-title">{isAdmin ? 'Liste des utilisateurs' : 'Mes informations'}</h2>
      {isAdmin && users.length === 0 && (
        <div data-testid="no-users-message">Aucun utilisateur</div>
      )}
      {isAdmin && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowAdminForm(v => !v)} className="create-admin-btn" data-testid="create-admin-btn">
            {showAdminForm ? 'Fermer' : 'Créer un administrateur'}
          </button>
          {showAdminForm && (
            <AdminCreationForm onSuccess={() => setShowAdminForm(false)} onClose={() => setShowAdminForm(false)} data-testid="admin-creation-form" />
          )}
        </div>
      )}
      {!isAdmin && !currentUserData && (
        <div data-testid="user-not-found">Utilisateur non trouvé</div>
      )}
      {isAdmin ? (
        <div className="admin-view" data-testid="admin-view">
          <table className="user-table">
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Ville</th>
                <th>Date de naissance</th>
                <th>Code postal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} data-testid={`user-row-${user.id}`}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.city}</td>
                  <td>{user.birthDate}</td>
                  <td>{user.postalCode}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/user/${user.id}`)}
                      data-testid={`user-detail-link-${user.id}`}
                    >
                      Voir
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      data-testid={`delete-user-${user.id}`}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="user-view" data-testid="user-view">
          <p><strong>Prénom :</strong> {currentUserData?.firstName}</p>
          <p><strong>Nom :</strong> {currentUserData?.lastName}</p>
          <p><strong>Email :</strong> {currentUserData?.email}</p>
          <p><strong>Date de naissance :</strong> {currentUserData?.birthDate}</p>
          <p><strong>Ville :</strong> {currentUserData?.city}</p>
          <p><strong>Code postal :</strong> {currentUserData?.postalCode}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
