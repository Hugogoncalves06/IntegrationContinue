import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_PYTHON_API}/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de l’utilisateur');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="loading" data-testid="user-loading">Chargement des informations...</div>;
  if (error) return <div className="error-message" data-testid="user-error">{error}</div>;
  if (!user) return null;

  return (
    <div className="user-detail-page" data-testid="user-detail-page">
      <button className="back-btn" data-testid="back-btn" onClick={() => navigate(-1)}>&larr; Retour</button>
      <h2 data-testid="user-detail-title">Détail de l'utilisateur</h2>
      <div className="user-detail-card" data-testid="user-detail-card">
        <p data-testid="user-firstName"><strong>Prénom :</strong> {user.firstName}</p>
        <p data-testid="user-lastName"><strong>Nom :</strong> {user.lastName}</p>
        <p data-testid="user-email"><strong>Email :</strong> {user.email}</p>
        <p data-testid="user-birthDate"><strong>Date de naissance :</strong> {user.birthDate}</p>
        <p data-testid="user-city"><strong>Ville :</strong> {user.city}</p>
        <p data-testid="user-postalCode"><strong>Code postal :</strong> {user.postalCode}</p>
      </div>
    </div>
  );
};

export default UserDetailPage;
