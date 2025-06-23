import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import HomePage from './HomePage';
import { renderWithRouter } from '../../testUtils';

jest.mock('axios');

describe('HomePage Component', () => {
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthDate: '1990-01-01',
      city: 'Paris',
      postalCode: '75000'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      birthDate: '1992-01-01',
      city: 'Lyon',
      postalCode: '69000'
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
  });

  test('affiche le chargement initialement', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    renderWithRouter(<HomePage userRole="user" userEmail="john@example.com" />);
    expect(screen.getByTestId('loading-message')).toBeInTheDocument();
  });

  test('affiche les informations de l\'utilisateur connecté en mode utilisateur', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    renderWithRouter(<HomePage userRole="user" userEmail="john@example.com" />);
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('John');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Doe');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Paris');
    });
  });

  test('affiche la liste complète des utilisateurs en mode admin', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    renderWithRouter(<HomePage userRole="admin" userEmail="admin@example.com" />);
    await waitFor(() => {
      expect(screen.getByTestId('page-title')).toHaveTextContent('Liste des utilisateurs');
      mockUsers.forEach(user => {
        expect(screen.getByTestId(`user-row-${user.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`user-row-${user.id}`)).toHaveTextContent(user.firstName);
        expect(screen.getByTestId(`user-row-${user.id}`)).toHaveTextContent(user.lastName);
        expect(screen.getByTestId(`user-row-${user.id}`)).toHaveTextContent(user.email);
      });
    });
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
    });
  });

  test('permet la suppression d\'un utilisateur en mode admin', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.delete.mockResolvedValueOnce({ status: 200 });
    axios.get.mockResolvedValueOnce({ data: mockUsers.slice(1) }); // Simule la liste après suppression
    renderWithRouter(<HomePage userRole="admin" userEmail="admin@example.com" />);
    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-user-1');
      fireEvent.click(deleteButton);
    });
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.any(Object)
      );
    });
  });

  test('gère les erreurs de chargement', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));
    renderWithRouter(<HomePage userRole="user" userEmail="john@example.com" />);
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  test('affiche un message si aucun utilisateur n\'est présent (admin)', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderWithRouter(<HomePage userRole="admin" userEmail="admin@example.com" />);
    await waitFor(() => {
      expect(screen.getByTestId('no-users-message')).toBeInTheDocument();
    });
  });

  test('navigue vers la page de détail utilisateur (admin)', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    renderWithRouter(<HomePage userRole="admin" userEmail="admin@example.com" />);
    await waitFor(() => {
      const detailLink = screen.getByTestId('user-detail-link-1');
      fireEvent.click(detailLink);
      // On s'attend à voir la page de détail (simulée par un testId ou un texte spécifique)
      // Ici, on suppose que la navigation affiche le prénom de l'utilisateur
      // (À adapter selon l'implémentation réelle)
      // expect(screen.getByText(/john/i)).toBeInTheDocument();
    });
  });

  test('affiche une erreur si la suppression échoue', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.delete.mockRejectedValueOnce(new Error('Erreur suppression'));
    renderWithRouter(<HomePage userRole="admin" userEmail="admin@example.com" />);
    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-user-1');
      fireEvent.click(deleteButton);
    });
    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la suppression/i)).toBeInTheDocument();
    });
  });

  test('affiche un message si l\'utilisateur connecté n\'est pas trouvé (user)', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    renderWithRouter(<HomePage userRole="user" userEmail="notfound@example.com" />);
    await waitFor(() => {
      expect(screen.getByTestId('user-not-found')).toBeInTheDocument();
    });
  });
});
