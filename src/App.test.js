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
    it.each([
      { field: 'input-firstName', value: '123', error: 'Le prénom n\'est pas valide' },
      { field: 'input-lastName', value: '123', error: 'Le nom n\'est pas valide' },
      { field: 'input-email', value: 'invalid-email', error: 'L\'email n\'est pas valide' },
      { 
      field: 'input-birthDate', 
      value: new Date(new Date().getFullYear() - 17, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0], 
      error: 'Vous devez avoir au moins 18 ans' 
      },
      { field: 'input-city', value: '', error: 'La ville n\'est pas valide' },
      { field: 'input-postalCode', value: 'abc', error: 'Le code postal n\'est pas valide' }
    ])('affiche une erreur pour le champ $field avec la valeur $value', ({ field, value, error }) => {
      fireEvent.change(screen.getByTestId(field), { target: { value } });
      fireEvent.blur(screen.getByTestId(field));
      fireEvent.submit(registrationForm);

      const errorMessage = screen.getByText(error);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});