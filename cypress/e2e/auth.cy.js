describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Permet de basculer entre les formulaires de connexion et d\'inscription', () => {
    // Vérifier que le formulaire de connexion est affiché par défaut
    cy.contains('Connexion').should('be.visible');
    cy.get('[data-testid="login-form"]').should('be.visible');

    // Basculer vers le formulaire d'inscription
    cy.contains('Inscription').click();
    cy.get('[data-testid="registration-form"]').should('be.visible');

    // Revenir au formulaire de connexion
    cy.contains('Connexion').click();
    cy.get('[data-testid="login-form"]').should('be.visible');
  });

  it('Affiche des erreurs pour les identifiants invalides', () => {
    // Tenter de se connecter avec des identifiants invalides
    cy.get('[data-testid="login-email"]').type('invalid@example.com');
    cy.get('[data-testid="login-password"]').type('wrongpassword');
    cy.get('[data-testid="login-form"]').submit();

    // Vérifier que l'erreur est affichée
    cy.get('[data-testid="login-error"]').should('be.visible');
  });

  it('Permet une connexion réussie en tant qu\'admin', () => {
    cy.get('[data-testid="login-email"]').type('admin@example.com');
    cy.get('[data-testid="login-password"]').type('admin123');
    cy.get('[data-testid="login-form"]').submit();

    // Vérifier la redirection et l'affichage du tableau de bord admin
    cy.url().should('include', '/home');
    cy.contains('Liste des utilisateurs').should('be.visible');
  });

  it('Permet une connexion réussie en tant qu\'utilisateur', () => {
    cy.get('[data-testid="login-email"]').type('user@example.com');
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-form"]').submit();

    // Vérifier la redirection et l'affichage des informations utilisateur
    cy.url().should('include', '/home');
    cy.contains('Mes informations').should('be.visible');
  });

  it('Permet une déconnexion réussie', () => {
    // Se connecter d'abord
    cy.get('[data-testid="login-email"]').type('user@example.com');
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-form"]').submit();

    // Se déconnecter
    cy.get('.logout-button').click();

    // Vérifier la redirection vers la page de connexion
    cy.url().should('not.include', '/home');
    cy.get('[data-testid="login-form"]').should('be.visible');
  });
});
