import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import HomePage from './HomePage';

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
    render(<HomePage userRole="user" userEmail="john@example.com" />);
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  test('affiche les informations de l\'utilisateur connecté en mode utilisateur', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    
    render(<HomePage userRole="user" userEmail="john@example.com" />);
    
    await waitFor(() => {
      expect(screen.getByText(/john/i)).toBeInTheDocument();
      expect(screen.getByText(/doe/i)).toBeInTheDocument();
      expect(screen.getByText(/paris/i)).toBeInTheDocument();
    });
  });

  test('affiche la liste complète des utilisateurs en mode admin', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    
    render(<HomePage userRole="admin" userEmail="admin@example.com" />);
    
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3); // En-tête + 2 utilisateurs
    });
  });

  test('permet la suppression d\'un utilisateur en mode admin', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.delete.mockResolvedValueOnce({ status: 200 });
    axios.get.mockResolvedValueOnce({ data: mockUsers.slice(1) }); // Simule la liste après suppression
    
    render(<HomePage userRole="admin" userEmail="admin@example.com" />);
    
    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-user-1');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `${process.env.PYTHON_APP_API_BASE_URL}/api/users/1`,
        expect.any(Object)
      );
    });
  });

  test('gère les erreurs de chargement', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));
    
    render(<HomePage userRole="user" userEmail="john@example.com" />);
    
    await waitFor(() => {
      expect(screen.getByText(/erreur lors du chargement/i)).toBeInTheDocument();
    });
  });
});
