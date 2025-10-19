describe('Members Feature', () => {
  const testUser = {
    email: 'pkhv@hotmail.fr',
    password: '123456',
  };

  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  describe('Navigation', () => {
    it('should display Members menu item', () => {
      cy.contains('Members').should('be.visible');
    });

    it('should navigate to Members page when clicking menu', () => {
      cy.contains('Members').click();
      cy.url().should('include', '/members');
      cy.contains('Liste des Membres').should('be.visible');
    });
  });

  describe('Members List Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/members');
    });

    it('should display the members list page', () => {
      cy.contains('Liste des Membres').should('be.visible');
      cy.contains('Total').should('be.visible');
    });

    it('should have an "Ajouter un membre" button', () => {
      cy.contains('button', 'Ajouter un membre').should('be.visible');
    });

    it('should display members table with correct columns', () => {
      cy.contains('th', 'Nom').should('be.visible');
      cy.contains('th', 'Prénom').should('be.visible');
      cy.contains('th', 'Email').should('be.visible');
      cy.contains('th', 'Rôle').should('be.visible');
      cy.contains('th', 'Club').should('be.visible');
      cy.contains('th', 'Actions').should('be.visible');
    });
  });

  describe('Create Member', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/members/new');
    });

    it('should display the member creation form', () => {
      cy.contains('Créer un Membre').should('be.visible');
      cy.get('input[placeholder="Nom"]').should('be.visible');
      cy.get('input[placeholder="Prénom"]').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.contains('Rôle').should('be.visible');
    });

    it('should create a new member', () => {
      const timestamp = Date.now();
      const memberData = {
        lastName: `Test${timestamp}`,
        firstName: `Member${timestamp}`,
        email: `member${timestamp}@test.com`,
      };

      // Fill in member information
      cy.get('input[placeholder="Nom"]').type(memberData.lastName);
      cy.get('input[placeholder="Prénom"]').type(memberData.firstName);
      cy.get('input[type="email"]').type(memberData.email);

      // Select role
      cy.contains('label', 'Rôle').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'USER').click();

      // Submit form
      cy.contains('button', 'Créer').click();

      // Should redirect to members list
      cy.url().should('include', '/members');
      cy.contains(memberData.email).should('be.visible');
    });

    it('should validate required fields', () => {
      // Try to submit without filling required fields
      cy.contains('button', 'Créer').click();

      // Should show validation errors
      cy.contains('requis').should('be.visible');
    });
  });

  describe('Edit Member', () => {
    let memberId: string;

    before(() => {
      // Create a test member via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/members',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          firstName: 'EditTest',
          lastName: 'Member',
          email: `edittest${Date.now()}@test.com`,
          role: 'USER',
        },
      }).then((response) => {
        memberId = response.body.id;
      });
    });

    it('should display the edit form with existing member data', () => {
      cy.visit(`http://localhost:3000/members/${memberId}/edit`);

      cy.contains('Modifier le Membre').should('be.visible');
      cy.get('input[placeholder="Prénom"]').should('have.value', 'EditTest');
      cy.get('input[placeholder="Nom"]').should('have.value', 'Member');
    });

    it('should update a member', () => {
      cy.visit(`http://localhost:3000/members/${memberId}/edit`);

      const newFirstName = `Updated${Date.now()}`;

      cy.get('input[placeholder="Prénom"]').clear().type(newFirstName);

      cy.contains('button', 'Sauvegarder').click();

      // Should redirect to members list
      cy.url().should('include', '/members');
      cy.contains(newFirstName).should('be.visible');
    });
  });

  describe('View Member', () => {
    let memberId: string;

    before(() => {
      // Create a test member via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/members',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          firstName: 'ViewTest',
          lastName: 'Member',
          email: `viewtest${Date.now()}@test.com`,
          role: 'USER',
        },
      }).then((response) => {
        memberId = response.body.id;
      });
    });

    it('should display member details', () => {
      cy.visit(`http://localhost:3000/members/${memberId}`);

      cy.contains('ViewTest').should('be.visible');
      cy.contains('Member').should('be.visible');
      cy.contains('USER').should('be.visible');
    });

    it('should have action buttons', () => {
      cy.visit(`http://localhost:3000/members/${memberId}`);

      cy.contains('button', 'Modifier').should('be.visible');
      cy.contains('button', 'Supprimer').should('be.visible');
    });
  });

  describe('Delete Member', () => {
    let memberId: string;

    beforeEach(() => {
      // Create a fresh test member for deletion
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/members',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          firstName: 'DeleteTest',
          lastName: 'Member',
          email: `deletetest${Date.now()}@test.com`,
          role: 'USER',
        },
      }).then((response) => {
        memberId = response.body.id;
      });
    });

    it('should delete a member from list page', () => {
      cy.visit('http://localhost:3000/members');

      // Find the member row and click delete icon
      cy.contains('tr', `deletetest`).within(() => {
        cy.get('[data-icon="delete"]').click();
      });

      // Confirm deletion
      cy.contains('button', 'Supprimer').click();

      // Member should be removed
      cy.contains(`deletetest`).should('not.exist');
    });
  });

  describe('Search and Filters', () => {
    before(() => {
      // Create test members with different roles
      const members = [
        { firstName: 'Admin', lastName: 'User', email: 'admin-test@test.com', role: 'ADMIN' },
        { firstName: 'Editor', lastName: 'User', email: 'editor-test@test.com', role: 'EDITOR' },
        { firstName: 'Regular', lastName: 'User', email: 'regular-test@test.com', role: 'USER' },
      ];

      members.forEach((member) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:8090/api/members',
          headers: {
            'X-User-Email': testUser.email,
          },
          body: member,
        });
      });
    });

    it('should search members by name', () => {
      cy.visit('http://localhost:3000/members');

      cy.get('input[placeholder*="Rechercher"]').type('Admin');
      cy.get('input[placeholder*="Rechercher"]').parent().find('button').click();

      cy.wait(1000);
      cy.get('table tbody tr').should('contain', 'Admin');
    });

    it('should filter members by role', () => {
      cy.visit('http://localhost:3000/members');

      // Filter by ADMIN role
      cy.contains('Rôle').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'ADMIN').click();

      cy.wait(1000);
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain', 'ADMIN');
      });
    });
  });
});
