describe('Home Page E2E', () => {
  const admin = { email: 'admin@dev.com', password: 'Test1234' };
  const user = { email: 'dev@test.com', password: 'Test1234' };

  function login({ email, password }) {
    cy.visit('/login');
    cy.get('[data-testid="input-email"]').type(email);
    cy.get('[data-testid="input-password"]').type(password);
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/home');
    cy.get('[data-testid="home-page"]').should('exist');
  }

  it('should show admin view for admin user', () => {
    login(admin);
    cy.get('[data-testid="page-title"]').should('contain', 'Liste des utilisateurs');
    cy.get('[data-testid="admin-view"]').should('exist');
    cy.get('[data-testid="create-admin-btn"]').should('exist');
    cy.get('table.user-table').should('exist');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
    // Test navigation to user detail page
    cy.get('tbody tr').first().within(() => {
      cy.get('button[data-testid^="user-detail-link-"]').click();
    });
    cy.get('[data-testid="user-detail-page"]').should('exist');
    cy.get('[data-testid="back-btn"]').click();
    cy.get('[data-testid="home-page"]').should('exist');
    // Test logout
    cy.get('[data-testid="logout-btn"]').click();
    cy.url().should('include', '/login');
  });

  it('should show user view for normal user', () => {
    login(user);
    cy.get('[data-testid="page-title"]').should('contain', 'Mes informations');
    cy.get('[data-testid="user-view"]').should('exist');
    cy.get('[data-testid="admin-view"]').should('not.exist');
    cy.get('[data-testid="create-admin-btn"]').should('not.exist');
    // Check personal info fields
    cy.get('[data-testid="user-view"]').within(() => {
      cy.contains('Prénom');
      cy.contains('Nom');
      cy.contains('Email');
      cy.contains('Date de naissance');
      cy.contains('Ville');
      cy.contains('Code postal');
    });
    // Test logout
    cy.get('[data-testid="logout-btn"]').click();
    cy.url().should('include', '/login');
  });

  it('admin can view and delete Jane Smith, and create a new admin', () => {
    login(admin);
    cy.get('[data-testid="admin-view"]').should('exist');
    // Find Jane Smith's row
    cy.get('tbody tr').contains('td', 'jane.smith@test.com').parent('tr').as('janeRow');
    // View details
    cy.get('@janeRow').within(() => {
      cy.get('button[data-testid^="user-detail-link-"]').click();
    });
    cy.get('[data-testid="user-detail-page"]').should('exist');
    cy.get('[data-testid="user-email"]').should('contain', 'jane.smith@test.com');
    cy.get('[data-testid="back-btn"]').click();
    cy.get('[data-testid="home-page"]').should('exist');
    // Delete Jane Smith
    cy.get('tbody tr').contains('td', 'jane.smith@test.com').parent('tr').within(() => {
      cy.get('button[data-testid^="delete-user-"]').click();
    });
    // After deletion, Jane Smith should not be in the table
    cy.get('tbody tr').should('not.contain', 'jane.smith@test.com');
    // Create a new admin
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-creation-form"]').should('exist');
    const uniqueEmail = `admin${Date.now()}@test.com`;
    cy.get('[data-testid="admin-email"]').type(uniqueEmail);
    cy.get('[data-testid="admin-password"]').type('Password123!');
    cy.get('[data-testid="admin-role"]').select('admin');
    cy.get('[data-testid="admin-submit"]').should('not.be.disabled').click();
    cy.get('[data-testid="admin-creation-form"]').should('not.exist');
  });

  it('admin can create a new admin successfully', () => {
    login(admin);
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-creation-form"]').should('exist');
    const uniqueEmail = `admin${Date.now()}@test.com`;
    cy.get('[data-testid="admin-email"]').type(uniqueEmail);
    cy.get('[data-testid="admin-password"]').type('Password123!');
    cy.get('[data-testid="admin-role"]').select('admin');
    cy.get('[data-testid="admin-submit"]').should('not.be.disabled').click();
    cy.get('[data-testid="admin-creation-form"]').should('not.exist');
  });

  it('admin creation fails with already used email', () => {
    login(admin);
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-creation-form"]').should('exist');
    cy.get('[data-testid="admin-email"]').type('admin@dev.com');
    cy.get('[data-testid="admin-password"]').type('Password123!');
    cy.get('[data-testid="admin-role"]').select('admin');
    cy.get('[data-testid="admin-submit"]').should('not.be.disabled').click();
    cy.get('[data-testid="admin-error"]').should('exist');
    cy.get('[data-testid="admin-creation-form"]').should('exist');
  });

  it('admin creation fails with invalid password', () => {
    login(admin);
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-creation-form"]').should('exist');
    const uniqueEmail = `admin${Date.now()}@test.com`;
    cy.get('[data-testid="admin-email"]').type(uniqueEmail);
    cy.get('[data-testid="admin-password"]').type('short'); // Invalid password
    cy.get('[data-testid="admin-role"]').select('admin');
    cy.get('[data-testid="admin-submit"]').should('be.disabled');
    cy.get('[data-testid="admin-creation-form"]').should('exist');
  });

  it('admin creation fails with invalid email and empty fields', () => {
    login(admin);
    cy.get('[data-testid="create-admin-btn"]').click();
    cy.get('[data-testid="admin-creation-form"]').should('exist');
    // Invalid email format
    cy.get('[data-testid="admin-email"]').type('notanemail');
    cy.get('[data-testid="admin-password"]').type('Password123!');
    cy.get('[data-testid="admin-role"]').select('admin');
    cy.get('[data-testid="admin-submit"]').should('be.disabled');
    // Clear fields
    cy.get('[data-testid="admin-email"]').clear();
    cy.get('[data-testid="admin-password"]').clear();
    cy.get('[data-testid="admin-submit"]').should('be.disabled');
    // All fields invalid
    cy.get('[data-testid="admin-email"]').type('bad');
    cy.get('[data-testid="admin-password"]').type('short');
    cy.get('[data-testid="admin-submit"]').should('be.disabled');
    cy.get('[data-testid="admin-creation-form"]').should('exist');
  });
}); 