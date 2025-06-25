import React from 'react';
import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App.js unit tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirects "/" to "/login"', () => {
    act(() => {
      window.history.pushState({}, 'Test page', '/');
      render(<App />);
    });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('renders AuthPage at "/login" when not authenticated', () => {
    act(() => {
      window.history.pushState({}, 'Test page', '/login');
      render(<App />);
    });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('redirects "/login" to "/home" when authenticated', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userEmail', 'test@example.com');
    // Mock the users fetch
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          birthDate: '2000-01-01',
          city: 'Paris',
          postalCode: '75000'
        }
      ]
    });
    act(() => {
      window.history.pushState({}, 'Test page', '/login');
      render(<App />);
    });
    await waitFor(() => {
      const homePage = screen.getByTestId('home-page');
      expect(homePage).toBeInTheDocument();
    });
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders HomePage at "/home" when authenticated', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userEmail', 'test@example.com');
    // Mock the users fetch
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          birthDate: '2000-01-01',
          city: 'Paris',
          postalCode: '75000'
        }
      ]
    });
    act(() => {
      window.history.pushState({}, 'Test page', '/home');
      render(<App />);
    });
    await waitFor(() => {
      const homePage = screen.getByTestId('home-page');
      expect(homePage).toBeInTheDocument();
    });
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('redirects "/home" to "/login" when not authenticated', () => {
    window.history.pushState({}, 'Test page', '/home');
    render(<App />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('redirects unknown route to "/login"', () => {
    window.history.pushState({}, 'Test page', '/unknown');
    render(<App />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('renders Toastr component when registration is successful', async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { message: 'User created successfully' }
    });
    act(() => {
      window.history.pushState({}, 'Test page', '/login');
      render(<App />);
    });
    const inscriptionBtn = screen.getByTestId('tab-inscription');
    fireEvent.click(inscriptionBtn);
    const registrationForm = screen.getByTestId('registration-form');
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75000' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password123!' } });
    const submitButton = screen.getByTestId('submit-registration');
    expect(submitButton).not.toBeDisabled();
    fireEvent.submit(registrationForm);
    await waitFor(() => {
      const toastrElement = screen.getByTestId('toast-success');
      expect(toastrElement).toBeInTheDocument();
    });
  });

  test('does not render Toastr component initially', () => {
    act(() => {
      window.history.pushState({}, 'Test page', '/login');
      render(<App />);
    });
    const toastrElement = screen.queryByTestId('toast-success');
    expect(toastrElement).not.toBeInTheDocument();
  });
});
