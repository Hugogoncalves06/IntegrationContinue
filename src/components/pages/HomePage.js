import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = ({ userRole, userEmail }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.PYTHON_APP_API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
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
      await axios.delete(`${process.env.PYTHON_APP_API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Rafraîchir la liste des utilisateurs
      fetchUsers();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const isAdmin = userRole === 'admin';
  const currentUserData = users.find(user => user.email === userEmail);

  return (
    <div className="home-page">
      <h2>Tableau de bord</h2>
      <div className="user-actions">
        <button onClick={() => localStorage.removeItem('token')} className="logout-button">
          Déconnexion
        </button>
      </div>
      
      {isAdmin ? (
        <div className="admin-view">
          <h3>Liste des utilisateurs</h3>
          <table>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Date de naissance</th>
                <th>Ville</th>
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
                  <td>{user.birthDate}</td>
                  <td>{user.city}</td>
                  <td>{user.postalCode}</td>
                  <td>
                    <button 
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
      ) : currentUserData ? (
        <div className="user-view">
          <h3>Mes informations</h3>
          <div className="user-info">
            <p><strong>Prénom:</strong> {currentUserData.firstName}</p>
            <p><strong>Nom:</strong> {currentUserData.lastName}</p>
            <p><strong>Email:</strong> {currentUserData.email}</p>
            <p><strong>Date de naissance:</strong> {currentUserData.birthDate}</p>
            <p><strong>Ville:</strong> {currentUserData.city}</p>
            <p><strong>Code postal:</strong> {currentUserData.postalCode}</p>
          </div>
        </div>
      ) : (
        <div>Aucune information disponible</div>
      )}
    </div>
  );
};

export default HomePage;
