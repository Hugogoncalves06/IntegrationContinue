import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import RegistrationForm from './RegistrationForm';

jest.mock('axios');

const setup = (props = {}) => {
  const setSuccessful = jest.fn();
  render(<RegistrationForm setSuccessful={setSuccessful} {...props} />);
  return { setSuccessful };
};

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all input fields and submit button', () => {
    setup();
    expect(screen.getByTestId('input-firstName')).toBeInTheDocument();
    expect(screen.getByTestId('input-lastName')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-birthDate')).toBeInTheDocument();
    expect(screen.getByTestId('input-city')).toBeInTheDocument();
    expect(screen.getByTestId('input-postalCode')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-registration')).toBeInTheDocument();
  });

  test('submit button is disabled if fields are empty or password rules not met', () => {
    setup();
    expect(screen.getByTestId('submit-registration')).toBeDisabled();
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'short' } });
    expect(screen.getByTestId('submit-registration')).toBeDisabled();
  });

  test('shows password rules feedback', () => {
    setup();
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'short' } });
    expect(screen.getByText(/Au moins 8 caractères/)).toBeInTheDocument();
    expect(screen.getByText(/Au moins une majuscule/)).toBeInTheDocument();
    expect(screen.getByText(/Au moins un chiffre/)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    setup();
    const passwordInput = screen.getByTestId('input-password');
    const toggleBtn = screen.getByTestId('toggle-password-visibility');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows validation errors for invalid fields', async () => {
    setup();
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: '123' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: '123' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2020-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: '1654' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: 'abc' } });
    expect(await screen.findByTestId('error-firstName')).toBeInTheDocument();
    expect(await screen.findByTestId('error-lastName')).toBeInTheDocument();
    expect(await screen.findByTestId('error-email')).toBeInTheDocument();
    expect(await screen.findByTestId('error-birthDate')).toBeInTheDocument();
    expect(await screen.findByTestId('error-city')).toBeInTheDocument();
    expect(await screen.findByTestId('error-postalCode')).toBeInTheDocument();
  });

  test('submits form and calls setSuccessful on success', async () => {
    const { setSuccessful } = setup();
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Lyon' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '69000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password1' } });

    axios.post.mockResolvedValueOnce({ status: 201, data: { message: 'User created' } });

    fireEvent.click(screen.getByTestId('submit-registration'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(setSuccessful).toHaveBeenCalledWith(true);
    });
  });

  test('shows error if email already exists (409)', async () => {
    setup();
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'exists@email.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Lyon' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '69000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password1' } });

    axios.post.mockRejectedValueOnce({ response: { status: 409 } });

    fireEvent.click(screen.getByTestId('submit-registration'));

    expect(await screen.findByTestId('error-email')).toHaveTextContent(/Cet email est déjà utilisé/);
  });

  test('does not call setSuccessful if validation fails', async () => {
    const { setSuccessful } = setup();
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-registration'));
    await waitFor(() => {
      expect(setSuccessful).not.toHaveBeenCalled();
    });
  });
});