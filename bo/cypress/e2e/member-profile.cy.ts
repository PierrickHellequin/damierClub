/// <reference types="cypress" />

describe('Member Profile with UUID', () => {
  let testUser: { id: string; email: string; password: string; name: string }

  before(() => {
    // Créer un utilisateur de test avant tous les tests
    cy.createTestUser().then((user) => {
      testUser = user
    })
  })

  beforeEach(() => {
    // Se connecter avant chaque test
    cy.login(testUser.email, testUser.password)
  })

  it('should access member profile with full UUID (not truncated)', () => {
    // Vérifier que l'ID est un UUID valide
    expect(testUser.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)

    // Accéder au profil avec l'UUID complet
    cy.visit(`/profil/${testUser.id}`)

    // Vérifier que l'URL contient l'UUID complet (pas tronqué en nombre)
    cy.url().should('include', `/profil/${testUser.id}`)
    cy.url().should('not.match', /\/profil\/\d+$/) // Ne doit PAS être un nombre

    // Vérifier que la page affiche les bonnes informations
    cy.contains('Profil membre').should('be.visible')
    cy.contains(testUser.email).should('be.visible')
    cy.contains(testUser.name).should('be.visible')
  })

  it('should NOT truncate UUID to number in API calls', () => {
    // Intercepter les appels API
    cy.intercept('GET', `/api/members/${testUser.id}`).as('getMember')

    cy.visit(`/profil/${testUser.id}`)

    // Attendre l'appel API et vérifier l'URL
    cy.wait('@getMember').then((interception) => {
      // Vérifier que l'URL contient l'UUID complet
      expect(interception.request.url).to.include(testUser.id)

      // Vérifier que l'URL ne contient PAS un nombre tronqué
      const urlParts = interception.request.url.split('/')
      const idInUrl = urlParts[urlParts.length - 1]

      // L'ID dans l'URL doit être l'UUID complet
      expect(idInUrl).to.equal(testUser.id)

      // L'ID ne doit PAS être un nombre
      expect(idInUrl).to.not.match(/^\d+$/)

      // La réponse doit retourner le membre avec l'UUID
      expect(interception.response?.statusCode).to.equal(200)
      expect(interception.response?.body).to.have.property('id', testUser.id)
    })
  })

  it('should handle UUID format correctly in the entire flow', () => {
    // Aller sur la liste des membres
    cy.visit('/members')

    // Vérifier que le tableau affiche des UUIDs
    cy.get('table').should('be.visible')

    // Trouver la ligne du membre de test et cliquer sur le lien Profil
    cy.contains('tr', testUser.email).within(() => {
      cy.contains('Profil').click()
    })

    // Vérifier que nous sommes redirigés vers la bonne URL avec UUID
    cy.url().should('include', `/profil/${testUser.id}`)

    // Vérifier que le profil s'affiche correctement
    cy.contains('Profil membre').should('be.visible')
    cy.contains(testUser.email).should('be.visible')
  })

  it('should return 404 for invalid UUID format', () => {
    // Tester avec un nombre (ancien format)
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/members/123`,
      headers: { 'X-User-Email': testUser.email },
      failOnStatusCode: false,
    }).then((response) => {
      // Devrait échouer car 123 n'est pas un UUID valide
      expect(response.status).to.be.oneOf([400, 404])
    })
  })

  it('should preserve UUID in edit and update operations', () => {
    cy.visit(`/profil/${testUser.id}`)

    // Cliquer sur éditer
    cy.contains('button', 'Éditer').click()

    // Modifier un champ
    const newName = `Updated${Date.now()}`
    cy.get('input[id*="name"]').clear().type(newName)

    // Intercepter l'appel PUT
    cy.intercept('PUT', `/api/members/${testUser.id}`).as('updateMember')

    // Sauvegarder
    cy.contains('button', 'Enregistrer').click()

    // Vérifier que l'appel PUT utilise l'UUID complet
    cy.wait('@updateMember').then((interception) => {
      expect(interception.request.url).to.include(testUser.id)
      expect(interception.response?.statusCode).to.equal(200)
    })

    // Vérifier que les données sont mises à jour
    cy.contains(newName).should('be.visible')
  })
})
