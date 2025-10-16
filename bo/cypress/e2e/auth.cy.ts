/// <reference types="cypress" />

describe('Authentication', () => {
  it('should register a new user and receive UUID', () => {
    const email = `test-${Date.now()}@example.com`
    const password = 'Test123456!'
    const name = `TestUser${Date.now()}`

    cy.visit('/register')

    cy.get('input[type="text"]').type(name)
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()

    // Vérifier la redirection
    cy.url().should('not.include', '/register')

    // Vérifier que l'utilisateur est connecté
    cy.contains(name).should('be.visible')

    // Vérifier que le localStorage contient un UUID
    cy.window().then((win) => {
      const sessionUser = win.localStorage.getItem('sessionUser')
      expect(sessionUser).to.not.be.null

      const user = JSON.parse(sessionUser!)
      expect(user).to.have.property('id')
      expect(user.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(user.id).to.not.match(/^\d+$/) // Ne doit PAS être un nombre
    })
  })

  it('should login with existing user', () => {
    // Créer un utilisateur via l'API
    cy.createTestUser().then((user) => {
      cy.visit('/login')

      cy.get('input[type="email"]').type(user.email)
      cy.get('input[type="password"]').type(user.password)
      cy.get('button[type="submit"]').click()

      // Vérifier la connexion
      cy.url().should('not.include', '/login')

      // Vérifier le localStorage
      cy.window().then((win) => {
        const sessionUser = win.localStorage.getItem('sessionUser')
        expect(sessionUser).to.not.be.null

        const storedUser = JSON.parse(sessionUser!)
        expect(storedUser.id).to.equal(user.id)
        expect(storedUser.email).to.equal(user.email)
      })
    })
  })
})
