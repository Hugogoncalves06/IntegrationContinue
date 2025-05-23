describe('Admin Dashboard Tests', () => {
  beforeEach(() => {
    // Simule une connexion admin
    cy.visit('http://localhost:3000');
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-admin-token');
      win.localStorage.setItem('userRole', 'admin');
      win.localStorage.setItem('userEmail', 'admin@example.com');
    });
    cy.visit('http://localhost:3000/home');
  });

  it('Affiche la liste des utilisateurs pour l\'admin', () => {
    cy.contains('Liste des utilisateurs');
    cy.get('table').should('exist');
    cy.get('th').should('have.length', 7); // Vérifie les colonnes du tableau
  });

  it('Permet de supprimer un utilisateur', () => {
    cy.get('[data-testid^="delete-user-"]').first().click();
    cy.get('[data-testid^="user-row-"]').should('have.length.lessThan', 2);
  });
});

describe('User Dashboard Tests', () => {
  beforeEach(() => {
    // Simule une connexion utilisateur
    cy.visit('http://localhost:3000');
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-user-token');
      win.localStorage.setItem('userRole', 'user');
      win.localStorage.setItem('userEmail', 'user@example.com');
    });
    cy.visit('http://localhost:3000/home');
  });

  it('Affiche uniquement les informations de l\'utilisateur connecté', () => {
    cy.contains('Mes informations');
    cy.get('table').should('not.exist'); // Pas de tableau pour les utilisateurs normaux
    cy.contains('user@example.com').should('exist');
  });
});
