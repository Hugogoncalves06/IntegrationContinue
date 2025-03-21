describe('template spec', () => {
  it('deployed react app to localhost', () => {
    cy.intercept('GET', 'https://ci-cd-back-ynov.vercel.app/users', {
      statusCode: 200,
      body: {
        utilisateurs: [
          {
            id: '1',
            nom: 'a',
            prenom: 'b',
            email: 'c@c.fr'
          },
          {
            id: '2',
            nom: 'a',
            prenom: 'b',
            email: 'c@c.fr'
          }
        ],
      },
    });

    cy.visit('http://localhost:3000')
    cy.contains('2 user(s) already registered')
  })

})