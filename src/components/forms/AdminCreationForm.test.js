import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminCreationForm from './AdminCreationForm';
import axios from 'axios';

jest.mock('axios');

const mockOnSuccess = jest.fn();
const mockOnClose = jest.fn();

const fillForm = async ({ email = 'admin@example.com', password = 'Password1!' } = {}) => {
  fireEvent.change(screen.getByTestId('admin-email'), { target: { value: email } });
  fireEvent.change(screen.getByTestId('admin-password'), { target: { value: password } });
};

describe('AdminCreationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('renders all fields and submit button', () => {
    render(<AdminCreationForm />);
    expect(screen.getByTestId('admin-email')).toBeInTheDocument();
    expect(screen.getByTestId('admin-password')).toBeInTheDocument();
    expect(screen.getByTestId('admin-role')).toBeInTheDocument();
    expect(screen.getByTestId('admin-submit')).toBeInTheDocument();
  });

  it('shows and hides password when toggle is clicked', () => {
    render(<AdminCreationForm />);
    const passwordInput = screen.getByTestId('admin-password');
    const toggle = screen.getByTestId('toggle-admin-password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggle);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggle);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('disables submit button if password does not meet rules', async () => {
    render(<AdminCreationForm />);
    await fillForm({ password: 'short' });
    expect(screen.getByTestId('admin-submit')).toBeDisabled();
  });

  it('enables submit button if password meets all rules', async () => {
    render(<AdminCreationForm />);
    await fillForm();
    expect(screen.getByTestId('admin-submit')).not.toBeDisabled();
  });

  it('shows password rules in green/red depending on validity', async () => {
    render(<AdminCreationForm />);
    await fillForm({ password: 'pass' });
    const rules = screen.getAllByRole('listitem');
    expect(rules[0]).toHaveStyle('color: red');
    expect(rules[1]).toHaveStyle('color: red');
    expect(rules[2]).toHaveStyle('color: red');
    await fillForm({ password: 'Password1' });
    expect(rules[0]).toHaveStyle('color: green');
    expect(rules[1]).toHaveStyle('color: green');
    expect(rules[2]).toHaveStyle('color: green');
  });

  it('submits form and calls onSuccess on success', async () => {
    axios.post.mockResolvedValueOnce({});
    render(<AdminCreationForm onSuccess={mockOnSuccess} />);
    await fillForm();
    fireEvent.click(screen.getByTestId('admin-submit'));
    expect(screen.getByTestId('admin-submit')).toBeDisabled();
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows error message on API error', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Erreur API' } } });
    render(<AdminCreationForm />);
    await fillForm();
    fireEvent.click(screen.getByTestId('admin-submit'));
    await waitFor(() => expect(screen.getByTestId('admin-error')).toHaveTextContent('Erreur API'));
  });

  it('shows generic error if API error has no message', async () => {
    axios.post.mockRejectedValueOnce({});
    render(<AdminCreationForm />);
    await fillForm();
    fireEvent.click(screen.getByTestId('admin-submit'));
    await waitFor(() => expect(screen.getByTestId('admin-error')).toHaveTextContent('Erreur lors de la création'));
  });

  it('calls onClose when Annuler button is clicked', () => {
    render(<AdminCreationForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/annuler/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('resets form after successful submit', async () => {
    axios.post.mockResolvedValueOnce({});
    render(<AdminCreationForm />);
    await fillForm();
    fireEvent.click(screen.getByTestId('admin-submit'));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(screen.getByTestId('admin-email')).toHaveValue('');
    expect(screen.getByTestId('admin-password')).toHaveValue('');
    expect(screen.getByTestId('admin-role')).toHaveValue('admin');
  });
});