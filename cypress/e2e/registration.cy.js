describe('Registration Page E2E', () => {
  const uniqueEmail = `testuser_${Date.now()}@test.com`;
  const validUser = {
    firstName: 'Test',
    lastName: 'User',
    email: uniqueEmail,
    birthDate: '2000-01-01',
    city: 'Paris',
    postalCode: '75000',
    password: 'Password123!'
  };

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="tab-inscription"]').click();
  });

  it('should successfully register a new user', () => {
    cy.get('[data-testid="input-firstName"]').type(validUser.firstName);
    cy.get('[data-testid="input-lastName"]').type(validUser.lastName);
    cy.get('[data-testid="input-email"]').type(validUser.email);
    cy.get('[data-testid="input-birthDate"]').type(validUser.birthDate);
    cy.get('[data-testid="input-city"]').type(validUser.city);
    cy.get('[data-testid="input-postalCode"]').type(validUser.postalCode);
    cy.get('[data-testid="input-password"]').type(validUser.password);
    cy.get('[data-testid="submit-registration"]').should('not.be.disabled').click();
    cy.get('[data-testid="toast-success"]').should('exist');
  });

  it('should not register with an already used email', () => {
    // Use the admin email which is already registered
    cy.get('[data-testid="input-firstName"]').type('Admin');
    cy.get('[data-testid="input-lastName"]').type('User');
    cy.get('[data-testid="input-email"]').type('dev@test.com');
    cy.get('[data-testid="input-birthDate"]').type('2000-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('[data-testid="submit-registration"]').should('not.be.disabled').click();
    cy.get('[data-testid="error-email"]').should('exist');
  });

  it('should show validation errors for invalid data', () => {
    cy.get('[data-testid="input-firstName"]').type('123'); // Invalid name
    cy.get('[data-testid="input-lastName"]').type('16512'); // Invalid name
    cy.get('[data-testid="input-email"]').type('notanemail'); // Invalid email
    cy.get('[data-testid="input-birthDate"]').type('2020-01-01'); // Under 18
    cy.get('[data-testid="input-city"]').type('123'); // Invalid city
    cy.get('[data-testid="input-postalCode"]').type('abc'); // Invalid postal code
    cy.get('[data-testid="input-password"]').type('short'); // Invalid password
    cy.get('[data-testid="submit-registration"]').should('be.disabled');
    cy.get('[data-testid="error-firstName"]').should('exist');
    cy.get('[data-testid="error-lastName"]').should('exist');
    cy.get('[data-testid="error-email"]').should('exist');
    cy.get('[data-testid="error-birthDate"]').should('exist');
    cy.get('[data-testid="error-city"]').should('exist');
    cy.get('[data-testid="error-postalCode"]').should('exist');
  });
}); 