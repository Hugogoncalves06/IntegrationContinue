/// <reference types="cypress" />

describe('Création d\'administrateur', () => {
  beforeEach(() => {
    cy.visit('/IntegrationContinue/login');
    // Connexion en tant qu'admin existant
    cy.get('[data-testid="login-email"]').type('admin@dev.com');
    cy.get('[data-testid="login-password"]').type('Admin1234');
    cy.get('[data-testid="login-form"]').submit();
    cy.url().should('include', '/home');
  });

  it('affiche le formulaire de création d\'admin', () => {
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-creation-form"]').should('be.visible');
    cy.get('[data-testid="admin-email"]').should('exist');
    cy.get('[data-testid="admin-password"]').should('exist');
    cy.get('[data-testid="admin-role"]').should('exist');
  });

  it('valide dynamiquement les prérequis du mot de passe', () => {
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-password"]').type('short');
    cy.get('[data-testid="password-criteria-length"]').should('have.class', 'invalid');
    cy.get('[data-testid="admin-password"]').clear().type('Longpassword');
    cy.get('[data-testid="password-criteria-digit"]').should('have.class', 'invalid');
    cy.get('[data-testid="admin-password"]').clear().type('Longpassword1');
    cy.get('[data-testid="password-criteria-length"]').should('have.class', 'valid');
    cy.get('[data-testid="password-criteria-digit"]').should('have.class', 'valid');
    cy.get('[data-testid="password-criteria-uppercase"]').should('have.class', 'valid');
  });

  it('peut afficher et masquer le mot de passe', () => {
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-password"]').type('Admin1234');
    cy.get('[data-testid="toggle-password-visibility"]').click();
    cy.get('[data-testid="admin-password"]').should('have.attr', 'type', 'text');
    cy.get('[data-testid="toggle-password-visibility"]').click();
    cy.get('[data-testid="admin-password"]').should('have.attr', 'type', 'password');
  });

  it('crée un nouvel administrateur avec un mot de passe valide', () => {
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-email"]').type('nouveladmin@dev.com');
    cy.get('[data-testid="admin-password"]').type('Admin1234');
    cy.get('[data-testid="admin-role"]').select('admin');
    cy.get('[data-testid="admin-creation-form"]').submit();
    cy.contains('Administrateur créé').should('exist');
  });
});
