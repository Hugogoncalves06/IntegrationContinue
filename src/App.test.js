import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import { renderWithRouter } from './testUtils';

jest.mock('axios');
describe('Success tests', () => {
  test('renders Toastr component when registration is successful', async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { message: 'User created successfully' }
    });
    renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
    // Naviguer vers le formulaire d'inscription
    const inscriptionBtn = screen.getByTestId('tab-inscription');
    fireEvent.click(inscriptionBtn);
    // Obtenir le formulaire d'inscription
    const registrationForm = screen.getByTestId('registration-form');
    // Remplir tous les champs
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password123!' } });
    // Vérifier que le bouton est activé
    const submitButton = screen.getByTestId('registration-submit');
    expect(submitButton).not.toBeDisabled();
    // Soumettre le formulaire
    fireEvent.submit(registrationForm);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        birthDate: '2000-01-01',
        city: 'Paris',
        postalCode: '75000',
        password: 'Password123!'
      })
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      const toastrElement = screen.getByTestId('toast-success');
      expect(toastrElement).toBeInTheDocument();
    });
  });

  test('does not render Toastr component initially', () => {
    renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
    const toastrElement = screen.queryByTestId('toast-success');
    expect(toastrElement).not.toBeInTheDocument();
  });
});

describe('Error tests', () => {
  describe('Validation des champs', () => {
    let registrationForm;
    beforeEach(() => {
      renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
      const inscriptionBtn = screen.getByTestId('tab-inscription');
      fireEvent.click(inscriptionBtn);
      registrationForm = screen.getByTestId('registration-form');
    });
    it.each([
      { field: 'input-firstName', value: '123', error: 'Le prénom n\'est pas valide' },
      { field: 'input-lastName', value: '123', error: 'Le nom n\'est pas valide' },
      { field: 'input-email', value: 'invalid-email', error: 'L\'email n\'est pas valide' },
      { field: 'input-birthDate', value: new Date(new Date().getFullYear() - 17, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0], error: 'Vous devez avoir au moins 18 ans' },
      { field: 'input-city', value: '', error: 'La ville n\'est pas valide' },
      { field: 'input-postalCode', value: 'abc', error: 'Le code postal n\'est pas valide' },
      { field: 'input-password', value: 'short', error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.' }
    ])('affiche une erreur pour le champ $field avec la valeur $value', ({ field, value, error }) => {
      fireEvent.change(screen.getByTestId(field), { target: { value } });
      fireEvent.blur(screen.getByTestId(field));
      fireEvent.submit(registrationForm);
      const errorMessage = screen.getByText(error);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

describe('Password field UI', () => {
  test('affiche et masque le mot de passe dynamiquement', () => {
    renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
    const inscriptionBtn = screen.getByTestId('tab-inscription');
    fireEvent.click(inscriptionBtn);
    const passwordInput = screen.getByTestId('input-password');
    // Par défaut, le type doit être password
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Cliquer sur l'icône d'affichage
    const toggleBtn = screen.getByTestId('toggle-password-visibility');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    // Recliquer masque à nouveau
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

describe('Error handling tests', () => {
  test('affiche une erreur quand l\'email existe déjà', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: { error: 'Email already exists' }
      }
    });
    renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
    const inscriptionBtn = screen.getByTestId('tab-inscription');
    fireEvent.click(inscriptionBtn);
    const registrationForm = screen.getByTestId('registration-form');
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'existing@email.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password123!' } });
    fireEvent.submit(registrationForm);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@email.com',
        birthDate: '2000-01-01',
        city: 'Paris',
        postalCode: '75000',
        password: 'Password123!'
      })
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    const errorMessage = await screen.findByText(/Cet email est déjà utilisé/i);
    expect(errorMessage).toBeInTheDocument();
  });
  test('affiche une erreur générique en cas d\'erreur serveur', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { error: 'Internal Server Error' }
      }
    });
    renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
    const inscriptionBtn = screen.getByTestId('tab-inscription');
    fireEvent.click(inscriptionBtn);
    const registrationForm = screen.getByTestId('registration-form');
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'error@email.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password123!' } });
    fireEvent.submit(registrationForm);
    const errorMessage = await screen.findByText(/Une erreur est survenue/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

describe('Navigation après inscription', () => {
  test('redirige vers la page de connexion après inscription réussie', async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { message: 'User created successfully' }
    });
    renderWithRouter(<App />, { route: '/IntegrationContinue/login' });
    const inscriptionBtn = screen.getByTestId('tab-inscription');
    fireEvent.click(inscriptionBtn);
    const registrationForm = screen.getByTestId('registration-form');
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jane.smith@example.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Lyon' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '69000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password123!' } });
    fireEvent.submit(registrationForm);
    await waitFor(() => {
      // On doit voir le formulaire de connexion
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });
});
describe('App routing and authentication', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirects "/" to "/login"', () => {
    const { container } = renderWithRouter(<App />, { route: '/' });
    expect(container.innerHTML).toMatch(/connexion/i);
  });

  test('renders AuthPage at "/login" when not authenticated', () => {
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('redirects "/login" to "/home" when authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userEmail', 'test@email.com');
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByText(/accueil/i)).toBeInTheDocument();
  });

  test('renders HomePage at "/home" when authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userEmail', 'admin@email.com');
    renderWithRouter(<App />, { route: '/home' });
    expect(screen.getByText(/accueil/i)).toBeInTheDocument();
  });

  test('redirects "/home" to "/login" when not authenticated', () => {
    renderWithRouter(<App />, { route: '/home' });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('renders UserDetailPage at "/user/:id"', () => {
    renderWithRouter(<App />, { route: '/user/123' });
    expect(screen.getByTestId('user-detail-page')).toBeInTheDocument();
  });

  test('redirects unknown route to "/login"', () => {
    renderWithRouter(<App />, { route: '/unknown' });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('logout clears localStorage and redirects to login', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userEmail', 'test@email.com');
    renderWithRouter(<App />, { route: '/home' });
    const logoutBtn = screen.getByTestId('logout-btn');
    fireEvent.click(logoutBtn);
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('calls onLoginSuccess and updates state', () => {
    renderWithRouter(<App />, { route: '/login' });
    // Simulate login success via AuthPage
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    const submitBtn = screen.getByTestId('login-submit');
    fireEvent.click(submitBtn);
    // Wait for HomePage after login
    return waitFor(() => {
      expect(screen.getByText(/accueil/i)).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('userRole')).toBeTruthy();
      expect(localStorage.getItem('userEmail')).toBe('user@email.com');
    });
  });
});