describe('Login Page E2E', () => {
  const users = [
    { email: 'admin@dev.com', password: 'Test1234', role: 'admin' },
    { email: 'dev@test.com', password: 'Test1234', role: 'user' },
  ];

  beforeEach(() => {
    cy.visit('/login');
  });

  users.forEach(({ email, password, role }) => {
    it(`should successfully login as ${role}`, () => {
      cy.get('[data-testid="input-email"]').clear().type(email);
      cy.get('[data-testid="input-password"]').clear().type(password);
      cy.get('[data-testid="login-submit"]').click();
      // After login, should redirect to /home and show home page
      cy.url().should('include', '/home');
      cy.get('[data-testid="home-page"]').should('exist');
      // Optionally, check for user/admin info on the page
    });
  });
}); 

describe('Login Page E2E', () => {
  it('should not login with wrong credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid="input-email"]').clear().type('admin@dev.com');
    cy.get('[data-testid="input-password"]').clear().type('wrongpassword');
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="login-error"]').should('exist');
  });
});