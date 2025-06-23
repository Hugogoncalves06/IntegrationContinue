import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthPage from './AuthPage';

// Mock child components
jest.mock('../forms/LoginForm', () => (props) => (
  <div data-testid="login-form">
    LoginForm
    <button onClick={() => props.onLoginSuccess && props.onLoginSuccess()}>LoginSuccess</button>
  </div>
));
jest.mock('../forms/RegistrationForm', () => (props) => (
  <div data-testid="registration-form">
    RegistrationForm
    <button onClick={() => props.setSuccessful && props.setSuccessful(true)}>SetSuccessful</button>
    <button onClick={() => props.onLoginSuccess && props.onLoginSuccess()}>LoginSuccess</button>
  </div>
));

describe('AuthPage', () => {
  it('renders header and tabs', () => {
    render(<AuthPage />);
    expect(screen.getByText('Journal des Citoyens')).toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });

  it('shows LoginForm by default', () => {
    render(<AuthPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('registration-form')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connexion' })).toHaveClass('active');
  });

  it('switches to RegistrationForm when Inscription tab is clicked', () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Inscription' }));
    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inscription' })).toHaveClass('active');
  });

  it('switches back to LoginForm when Connexion tab is clicked', () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Inscription' }));
    fireEvent.click(screen.getByRole('button', { name: 'Connexion' }));
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('registration-form')).not.toBeInTheDocument();
  });

  it('calls onLoginSuccess when LoginForm triggers it', () => {
    const onLoginSuccess = jest.fn();
    render(<AuthPage onLoginSuccess={onLoginSuccess} />);
    fireEvent.click(screen.getByText('LoginSuccess'));
    expect(onLoginSuccess).toHaveBeenCalled();
  });

  it('calls setSuccessful and onLoginSuccess from RegistrationForm', () => {
    const setSuccessful = jest.fn();
    const onLoginSuccess = jest.fn();
    render(<AuthPage setSuccessful={setSuccessful} onLoginSuccess={onLoginSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inscription' }));
    fireEvent.click(screen.getByText('SetSuccessful'));
    expect(setSuccessful).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByText('LoginSuccess'));
    expect(onLoginSuccess).toHaveBeenCalled();
  });
});