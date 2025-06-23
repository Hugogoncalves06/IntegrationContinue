describe('Form Validations E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Inscription').click();
  });

  it('validates all form fields on submission', () => {
    // Try to submit empty form
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="error-firstName"]').should('exist');
    cy.get('[data-testid="error-lastName"]').should('exist');
    cy.get('[data-testid="error-email"]').should('exist');
    cy.get('[data-testid="error-birthDate"]').should('exist');
    cy.get('[data-testid="error-city"]').should('exist');
    cy.get('[data-testid="error-postalCode"]').should('exist');
    cy.get('[data-testid="error-password"]').should('exist');
  });

  it('validates name fields format', () => {
    cy.get('[data-testid="input-firstName"]').type('John123');
    cy.get('[data-testid="input-lastName"]').type('Doe456');
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="error-firstName"]').should('exist');
    cy.get('[data-testid="error-lastName"]').should('exist');
  });

  it('validates email format', () => {
    cy.get('[data-testid="input-email"]').type('invalid-email');
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="error-email"]').should('exist');
  });

  it('validates age requirement', () => {
    const today = new Date();
    const under18Date = new Date(today.setFullYear(today.getFullYear() - 17));
    const dateString = under18Date.toISOString().split('T')[0];
    
    cy.get('[data-testid="input-birthDate"]').type(dateString);
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="error-birthDate"]').should('exist');
  });

  it('validates postal code format', () => {
    cy.get('[data-testid="input-postalCode"]').type('123');
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="error-postalCode"]').should('exist');
  });

  it('shows success message for valid form submission', () => {
    const randomEmail = `test${Date.now()}@example.com`;
    
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type(randomEmail);
    cy.get('[data-testid="input-birthDate"]').type('1990-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });

  it('valide la présence et la validation du mot de passe', () => {
    cy.get('[data-testid="input-password"]').should('exist');
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="error-password"]').should('exist');

    // Test des bullet points dynamiques
    cy.get('[data-testid="input-password"]').type('short');
    cy.contains('❌ Au moins 8 caractères').should('exist');
    cy.contains('❌ Au moins une majuscule').should('exist');
    cy.contains('❌ Au moins un chiffre').should('exist');
    cy.get('[data-testid="input-password"]').clear().type('Longpassword');
    cy.contains('✔️ Au moins 8 caractères').should('exist');
    cy.contains('✔️ Au moins une majuscule').should('exist');
    cy.contains('❌ Au moins un chiffre').should('exist');
    cy.get('[data-testid="input-password"]').clear().type('Password1');
    cy.contains('✔️ Au moins 8 caractères').should('exist');
    cy.contains('✔️ Au moins une majuscule').should('exist');
    cy.contains('✔️ Au moins un chiffre').should('exist');
  });

  it('permet d’afficher et masquer le mot de passe', () => {
    cy.get('[data-testid="input-password"]').type('Password1');
    cy.get('[data-testid="input-password"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="toggle-password-visibility"]').click();
    cy.get('[data-testid="input-password"]').should('have.attr', 'type', 'text');
    cy.get('[data-testid="toggle-password-visibility"]').click();
    cy.get('[data-testid="input-password"]').should('have.attr', 'type', 'password');
  });

  it('empêche la soumission si le mot de passe ne respecte pas les règles', () => {
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe@example.com');
    cy.get('[data-testid="input-birthDate"]').type('1990-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('short');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('[data-testid="input-password"]').clear().type('Password1');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
