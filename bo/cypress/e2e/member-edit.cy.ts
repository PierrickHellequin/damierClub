describe('Member Edit Flow', () => {
  const testMemberId = '019a0000-0000-7000-8000-000000000002';

  beforeEach(() => {
    // Login first
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type('pkhv@hotmail.fr');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    // Wait for redirect after login
    cy.url().should('not.include', '/login');
  });

  it('should redirect to edit page when clicking Edit button from profile page', () => {
    // Visit member profile page
    cy.visit(`http://localhost:3000/profil/${testMemberId}`);

    // Wait for page to load
    cy.contains('Profil du membre').should('be.visible');

    // Click the "Modifier" button
    cy.contains('button', 'Modifier').click();

    // Should redirect to edit page
    cy.url().should('include', `/members/edit/${testMemberId}`);

    // Edit page should be loaded
    cy.contains('Modifier le membre').should('be.visible');

    // Form should be pre-filled with member data
    cy.get('input[id="name"]').should('not.have.value', '');
    cy.get('input[id="email"]').should('not.have.value', '');
  });

  it('should redirect to edit page when clicking Edit icon from members list', () => {
    // Visit members list page
    cy.visit('http://localhost:3000/members');

    // Wait for page to load
    cy.contains('Gestion des Membres').should('be.visible');

    // Switch to table view to see edit buttons
    cy.contains('button', 'Vue tableau').click();

    // Wait for table to load
    cy.get('table').should('be.visible');

    // Click first edit button (icon with Edit class)
    cy.get('button').filter(':has(svg)').eq(1).click(); // Second icon button should be Edit

    // Should redirect to edit page
    cy.url().should('include', '/members/edit/');

    // Edit page should be loaded
    cy.contains('Modifier le membre').should('be.visible');
  });

  it('should save changes and redirect back to members list', () => {
    // Visit edit page directly
    cy.visit(`http://localhost:3000/members/edit/${testMemberId}`);

    // Wait for page to load
    cy.contains('Modifier le membre').should('be.visible');

    // Wait for form to be populated
    cy.get('input[id="name"]').should('not.have.value', '');

    // Modify a field
    const newCity = `Test City ${Date.now()}`;
    cy.get('input[id="city"]').clear().type(newCity);

    // Click save button
    cy.contains('button', 'Enregistrer les modifications').click();

    // Should redirect back to members list
    cy.url().should('eq', 'http://localhost:3000/members');

    // Success message should appear
    cy.contains('Membre mis à jour avec succès').should('be.visible');
  });

  it('should not open a drawer/slider when clicking Modifier on profile page', () => {
    // Visit member profile page
    cy.visit(`http://localhost:3000/profil/${testMemberId}`);

    // Wait for page to load
    cy.contains('Profil du membre').should('be.visible');

    // Click the "Modifier" button
    cy.contains('button', 'Modifier').click();

    // Should NOT have a drawer/slider open (Ant Design Drawer has class ant-drawer)
    cy.get('.ant-drawer').should('not.exist');

    // Should be on the edit page instead
    cy.url().should('include', `/members/edit/${testMemberId}`);
  });
});
