describe('Complete User Flow', () => {
  it('Permet à un utilisateur de s\'inscrire, se connecter et voir ses informations', () => {
    // 1. Inscription
    cy.visit('/');
    cy.contains('Inscription').click();
    
    const email = `user${Date.now()}@example.com`;
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type(email);
    cy.get('[data-testid="input-birthDate"]').type('1990-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    
    cy.get('[data-testid="registration-form"]').submit();
    cy.get('[data-testid="toast-success"]').should('be.visible');

    // 2. Connexion
    cy.contains('Connexion').click();
    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-form"]').submit();

    // 3. Vérification des informations
    cy.url().should('include', '/home');
    cy.contains('Mes informations').should('be.visible');
    cy.contains(email).should('be.visible');
    cy.contains('John').should('be.visible');
    cy.contains('Doe').should('be.visible');
  });

  it('Permet à un admin de gérer les utilisateurs', () => {
    // 1. Connexion admin
    cy.visit('/');
    cy.get('[data-testid="login-email"]').type('admin@example.com');
    cy.get('[data-testid="login-password"]').type('admin123');
    cy.get('[data-testid="login-form"]').submit();

    // 2. Vérification du tableau de bord admin
    cy.url().should('include', '/home');
    cy.contains('Liste des utilisateurs').should('be.visible');

    // 3. Suppression d'un utilisateur
    cy.get('[data-testid^="delete-user-"]').first().should('be.visible').click();
    cy.contains('Utilisateur supprimé').should('be.visible');

    // 4. Vérification que l'utilisateur a été supprimé
    cy.get('tbody tr').should('have.length.lessThan', 2);

    // 5. Déconnexion
    cy.get('.logout-button').click();
    cy.url().should('not.include', '/home');
  });

  it('Valide correctement les champs du formulaire d\'inscription', () => {
    cy.visit('/');
    cy.contains('Inscription').click();

    // Test de validation du prénom
    cy.get('[data-testid="input-firstName"]').type('123');
    cy.get('[data-testid="error-firstName"]').should('be.visible');

    // Test de validation du nom
    cy.get('[data-testid="input-lastName"]').type('456');
    cy.get('[data-testid="error-lastName"]').should('be.visible');

    // Test de validation de l'email
    cy.get('[data-testid="input-email"]').type('invalid-email');
    cy.get('[data-testid="error-email"]').should('be.visible');

    // Test de validation de la date de naissance
    cy.get('[data-testid="input-birthDate"]').type('2020-01-01');
    cy.get('[data-testid="error-birthDate"]').should('be.visible');

    // Test de validation du code postal
    cy.get('[data-testid="input-postalCode"]').type('123');
    cy.get('[data-testid="error-postalCode"]').should('be.visible');

    // Le bouton devrait être désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
