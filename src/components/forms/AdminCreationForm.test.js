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
  });

  it('shows error message on API error', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Erreur API' } } });
    render(<AdminCreationForm />);
    await fillForm();
    fireEvent.click(screen.getByTestId('admin-submit'));
    await waitFor(() => expect(screen.getByTestId('admin-error')).toHaveTextContent('Erreur API'));
  });

  it('calls onClose when Annuler button is clicked', () => {
    render(<AdminCreationForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/annuler/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables submit button if email is invalid', async () => {
    render(<AdminCreationForm />);
    await fillForm({ email: 'notanemail', password: 'Password1!' });
    expect(screen.getByTestId('admin-submit')).toBeDisabled();
    expect(screen.getByTestId('admin-email-error')).toHaveTextContent("L'email n'est pas valide");
  });

  it('enables submit button if email is valid and password meets all rules', async () => {
    render(<AdminCreationForm />);
    await fillForm({ email: 'admin@example.com', password: 'Password1!' });
    expect(screen.getByTestId('admin-submit')).not.toBeDisabled();
    expect(screen.queryByTestId('admin-email-error')).not.toBeInTheDocument();
  });

  it('shows and hides email error as user types', async () => {
    render(<AdminCreationForm />);
    const emailInput = screen.getByTestId('admin-email');
    fireEvent.change(emailInput, { target: { value: 'bad' } });
    expect(screen.getByTestId('admin-email-error')).toHaveTextContent("L'email n'est pas valide");
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    expect(screen.queryByTestId('admin-email-error')).not.toBeInTheDocument();
  });
});