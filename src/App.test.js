import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders registration form header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Formulaire d'enregistrement/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders registration form component', () => {
    render(<App />);
    // Check if the form is rendered by looking for common form elements
    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
  });
});
