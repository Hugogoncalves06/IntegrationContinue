describe('Tests End-to-End', () => {
  
  beforeEach(() => {
    // Reset avant chaque test
    cy.visit('http://localhost:3000');
  });

  it('Permet de s\'inscrire puis de voir ses informations', () => {
    // Test d'inscription
    cy.get('[data-testid="input-firstName"]').type('John');
    cy.get('[data-testid="input-lastName"]').type('Doe');
    cy.get('[data-testid="input-email"]').type('john.doe2@example.com');
    cy.get('[data-testid="input-birthDate"]').type('1990-01-01');
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');
    cy.get('[data-testid="input-password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // Vérification du toast de succès
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });

  it('Permet à un admin de se connecter et de gérer les utilisateurs', () => {
    // Login admin
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-admin-token');
      win.localStorage.setItem('userRole', 'admin');
      win.localStorage.setItem('userEmail', 'admin@example.com');
    });
    cy.visit('http://localhost:3000/home');

    // Vérification de la vue admin
    cy.contains('Liste des utilisateurs');
    cy.get('table').should('be.visible');

    // Test de suppression d'utilisateur
    cy.get('[data-testid^="delete-user-"]').first().click();
    cy.get('[data-testid^="user-row-"]').should('have.length.lessThan', 2);
  });

  it('Affiche les informations d\'un utilisateur normal', () => {
    // Login utilisateur normal
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-user-token');
      win.localStorage.setItem('userRole', 'user');
      win.localStorage.setItem('userEmail', 'john.doe@example.com');
    });
    cy.visit('http://localhost:3000/home');

    // Vérification des informations personnelles
    cy.contains('Mes informations');
    cy.contains('john.doe@example.com');
  });
});
