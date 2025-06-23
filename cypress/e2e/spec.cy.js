describe('RegistrationForm Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Check if the page contains all forms data', () => {
    cy.contains("Formulaire d'enregistrement")
    cy.contains('Prénom')
    cy.contains('Nom')
    cy.contains('Email')
    cy.contains('Date de naissance')
    cy.contains('Ville')
    cy.contains('Code postal')
  })

  it('should display all form fields', () => {
    cy.contains("Formulaire d'enregistrement");
    cy.get('[data-testid="input-firstName"]').should('exist');
    cy.get('[data-testid="input-lastName"]').should('exist');
    cy.get('[data-testid="input-email"]').should('exist');
    cy.get('[data-testid="input-birthDate"]').should('exist');
    cy.get('[data-testid="input-city"]').should('exist');
    cy.get('[data-testid="input-postalCode"]').should('exist');
  });

  it('should validate and submit the form successfully', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe@example.com');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Check if api is called
    cy.intercept('POST', '/api/registration').as('postRegistration');
  });

  it('should keep the button disabled when first name is incomplete', () => {
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe@test.eu');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should keep the button disabled when last name is incomplete', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-email"]').type('john.doe@test.eu');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should keep the button disabled when email is incomplete', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should keep the button disabled when birth date is incomplete', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe@test.eu');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should keep the button disabled when city is incomplete', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe@test.eu');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should keep the button disabled when postal code is incomplete', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe@test.eu');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').should('be.disabled');
  });
});