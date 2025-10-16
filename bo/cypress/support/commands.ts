/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Commande personnalisée pour se connecter
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>

      /**
       * Commande pour créer un utilisateur de test via l'API
       * @example cy.createTestUser()
       */
      createTestUser(): Chainable<{ id: string; email: string; password: string }>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('createTestUser', () => {
  const email = `test-${Date.now()}@example.com`
  const password = 'Test123456!'
  const name = `TestUser${Date.now()}`

  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/internal/register`,
    body: { name, email, password },
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('id')
    expect(response.body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)

    return { id: response.body.id, email, password, name }
  })
})

export {}
