import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Success tests', () => {
  test('renders Toastr component when registration is successful', () => {
    render(<App />);
    // Simulate successful registration
    const registrationForm = screen.getByTestId('registration-form');

    // Fill out the form fields with valid data
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75000' } });

    // Enable the submit button by ensuring all fields are valid
    const submitButton = screen.getByRole('button', { name: /sauvegarder/i });
    expect(submitButton).not.toBeDisabled();

    // Submit the form
    fireEvent.submit(registrationForm);

    // Check if Toastr component is rendered
    const toastrElement = screen.getByTestId('toast-success');
    expect(toastrElement).toBeInTheDocument();
  });
  
  test('does not render Toastr component initially', () => {
    render(<App />);
    // Ensure Toastr is not rendered on initial load
    const toastrElement = screen.queryByText(/success/i);
    expect(toastrElement).not.toBeInTheDocument();
  });
});

describe('Error tests', () => {
  describe('Validation des champs', () => {
    let registrationForm;
    beforeEach(() => {
      render(<App />);
      registrationForm = screen.getByTestId('registration-form');
    });

    test('affiche une erreur quand le prénom est invalide', () => {
      fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: '123' } });
      fireEvent.blur(screen.getByTestId('input-firstName'));
      
      fireEvent.submit(registrationForm);
      const errorMessage = screen.getByText('Le prénom n\'est pas valide');
      expect(errorMessage).toBeInTheDocument();
    });

    test('affiche une erreur quand le nom est invalide', () => {
      
      fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: '123' } });
      fireEvent.blur(screen.getByTestId('input-lastName'));
      fireEvent.submit(registrationForm);

      const errorMessage = screen.getByText('Le nom n\'est pas valide');
      expect(errorMessage).toBeInTheDocument();
    });

    test('affiche une erreur quand l\'email est invalide', () => {
      
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'invalid-email' } });
      fireEvent.blur(screen.getByTestId('input-email'));
      fireEvent.submit(registrationForm);

      const errorMessage = screen.getByText('L\'email n\'est pas valide');
      expect(errorMessage).toBeInTheDocument();
    });

    test('affiche une erreur quand l\'utilisateur a moins de 18 ans', () => {
      
      const today = new Date();
      const minorDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate()).toISOString().split('T')[0];
      fireEvent.change(screen.getByTestId('input-birthDate'), { target: { value: minorDate } });
      fireEvent.blur(screen.getByTestId('input-birthDate'));
      fireEvent.submit(registrationForm);

      const errorMessage = screen.getByText('Vous devez avoir au moins 18 ans');
      expect(errorMessage).toBeInTheDocument();
    });

    test('affiche une erreur quand la ville est vide', () => {
      
      fireEvent.change(screen.getByTestId('input-city'), { target: { value: '' } });
      fireEvent.blur(screen.getByTestId('input-city'));
      fireEvent.submit(registrationForm);

      const errorMessage = screen.getByText('La ville est requise');
      expect(errorMessage).toBeInTheDocument();
    });

    test('affiche une erreur quand le code postal est invalide', () => {
      
      fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: 'abc' } });
      fireEvent.blur(screen.getByTestId('input-postalCode'));
      fireEvent.submit(registrationForm);

      const errorMessage = screen.getByText('Le code postal n\'est pas valide');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});