import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import LoginForm from './LoginForm';

jest.mock('axios');

describe('LoginForm Component', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all fields', () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
  });

  test('handles successful login for admin', async () => {
    const mockResponse = {
      data: {
        token: 'fake-token',
        email: 'admin@example.com',
        role: 'admin'
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByTestId('login-email'), {
      target: { value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByTestId('login-password'), {
      target: { value: 'password123' }
    });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(
        'fake-token',
        'admin',
        'admin@example.com'
      );
    });
  });

  test('handles successful login for regular user', async () => {
    const mockResponse = {
      data: {
        token: 'fake-token',
        email: 'user@example.com',
        role: 'user'
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByTestId('login-email'), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByTestId('login-password'), {
      target: { value: 'password123' }
    });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(
        'fake-token',
        'user',
        'user@example.com'
      );
    });
  });

  test('displays error message on failed login', async () => {
    const errorMessage = 'Email ou mot de passe incorrect';
    axios.post.mockRejectedValueOnce({
      response: { data: { error: errorMessage } }
    });

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByTestId('login-email'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByTestId('login-password'), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error')).toHaveTextContent(errorMessage);
    });
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });

  test('handles network error during login', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByTestId('login-email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByTestId('login-password'), {
      target: { value: 'password123' }
    });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error')).toHaveTextContent('Erreur lors de la connexion');
    });
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });
});
