import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserDetailPage from './UserDetailPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

const mockUser = {
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice.martin@example.com',
  birthDate: '1990-05-10',
  city: 'Lyon',
  postalCode: '69000'
};

const renderWithRouter = (id = '123') => {
  window.localStorage.setItem('token', 'fake-token');
  return render(
    <MemoryRouter initialEntries={[`/users/${id}`]}>
      <Routes>
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('UserDetailPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('affiche le message de chargement pendant le chargement', async () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderWithRouter();
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
  });

  it('affiche les informations de l’utilisateur après chargement', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUser });
    renderWithRouter();
    expect(await screen.findByTestId('user-detail-title')).toBeInTheDocument();
    expect(screen.getByTestId('user-firstName')).toHaveTextContent(mockUser.firstName);
    expect(screen.getByTestId('user-lastName')).toHaveTextContent(mockUser.lastName);
    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
    expect(screen.getByTestId('user-birthDate')).toHaveTextContent(mockUser.birthDate);
    expect(screen.getByTestId('user-city')).toHaveTextContent(mockUser.city);
    expect(screen.getByTestId('user-postalCode')).toHaveTextContent(mockUser.postalCode);
  });

  it('affiche un message d’erreur en cas d’échec du chargement', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur'));
    renderWithRouter();
    expect(await screen.findByTestId('user-error')).toBeInTheDocument();
  });
});