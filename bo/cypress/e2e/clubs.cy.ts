describe('Clubs Feature', () => {
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
    it('should display Clubs menu item', () => {
      cy.contains('Clubs').should('be.visible');
    });

    it('should navigate to Clubs page when clicking menu', () => {
      cy.contains('Clubs').click();
      cy.url().should('include', '/clubs');
      cy.contains('Liste des Clubs').should('be.visible');
    });
  });

  describe('Clubs List Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/clubs');
    });

    it('should display the clubs list page', () => {
      cy.contains('Liste des Clubs').should('be.visible');
      cy.contains('Total').should('be.visible');
    });

    it('should have an "Ajouter un club" button', () => {
      cy.contains('button', 'Ajouter un club').should('be.visible');
    });

    it('should display clubs table with correct columns', () => {
      cy.contains('th', 'Nom').should('be.visible');
      cy.contains('th', 'Ville').should('be.visible');
      cy.contains('th', 'Email').should('be.visible');
      cy.contains('th', 'Téléphone').should('be.visible');
      cy.contains('th', 'Actions').should('be.visible');
    });
  });

  describe('Create Club', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/clubs/new');
    });

    it('should display the club creation form', () => {
      cy.contains('Créer un Club').should('be.visible');
      cy.get('input[placeholder="Nom du club"]').should('be.visible');
      cy.get('input[placeholder="Ville"]').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
    });

    it('should create a new club', () => {
      const timestamp = Date.now();
      const clubData = {
        name: `Club Test ${timestamp}`,
        city: 'Paris',
        email: `club${timestamp}@test.com`,
        phone: '0123456789',
        address: '123 Rue de Test',
        zipCode: '75001',
      };

      // Fill in club information
      cy.get('input[placeholder="Nom du club"]').type(clubData.name);
      cy.get('input[placeholder="Ville"]').type(clubData.city);
      cy.get('input[type="email"]').type(clubData.email);
      cy.get('input[placeholder="Téléphone"]').type(clubData.phone);
      cy.get('input[placeholder="Adresse"]').type(clubData.address);
      cy.get('input[placeholder="Code postal"]').type(clubData.zipCode);

      // Submit form
      cy.contains('button', 'Créer').click();

      // Should redirect to clubs list
      cy.url().should('include', '/clubs');
      cy.contains(clubData.name).should('be.visible');
    });

    it('should validate required fields', () => {
      // Try to submit without filling required fields
      cy.contains('button', 'Créer').click();

      // Should show validation errors
      cy.contains('requis').should('be.visible');
    });
  });

  describe('Edit Club', () => {
    let clubId: string;

    before(() => {
      // Create a test club via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/clubs',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          name: `Edit Test Club ${Date.now()}`,
          city: 'Lyon',
          email: `editclub${Date.now()}@test.com`,
          phone: '0123456789',
          address: '456 Rue Edit',
          zipCode: '69001',
        },
      }).then((response) => {
        clubId = response.body.id;
      });
    });

    it('should display the edit form with existing club data', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}/edit`);

      cy.contains('Modifier le Club').should('be.visible');
      cy.get('input[placeholder="Nom du club"]').should('include.value', 'Edit Test Club');
      cy.get('input[placeholder="Ville"]').should('have.value', 'Lyon');
    });

    it('should update a club', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}/edit`);

      const newCity = 'Marseille';

      cy.get('input[placeholder="Ville"]').clear().type(newCity);

      cy.contains('button', 'Sauvegarder').click();

      // Should redirect to clubs list
      cy.url().should('include', '/clubs');
      cy.contains(newCity).should('be.visible');
    });
  });

  describe('View Club', () => {
    let clubId: string;

    before(() => {
      // Create a test club via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/clubs',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          name: `View Test Club ${Date.now()}`,
          city: 'Toulouse',
          email: `viewclub${Date.now()}@test.com`,
          phone: '0123456789',
          address: '789 Rue View',
          zipCode: '31000',
          website: 'https://test-club.com',
          description: 'This is a test club for viewing',
        },
      }).then((response) => {
        clubId = response.body.id;
      });
    });

    it('should display club details', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}`);

      cy.contains('View Test Club').should('be.visible');
      cy.contains('Toulouse').should('be.visible');
      cy.contains('789 Rue View').should('be.visible');
      cy.contains('31000').should('be.visible');
      cy.contains('https://test-club.com').should('be.visible');
      cy.contains('This is a test club for viewing').should('be.visible');
    });

    it('should have action buttons', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}`);

      cy.contains('button', 'Modifier').should('be.visible');
      cy.contains('button', 'Supprimer').should('be.visible');
    });

    it('should navigate to edit page when clicking Modifier', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}`);

      cy.contains('button', 'Modifier').click();
      cy.url().should('include', `/clubs/${clubId}/edit`);
    });
  });

  describe('Delete Club', () => {
    let clubId: string;

    beforeEach(() => {
      // Create a fresh test club for deletion
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/clubs',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          name: `Delete Test Club ${Date.now()}`,
          city: 'Bordeaux',
          email: `deleteclub${Date.now()}@test.com`,
          phone: '0123456789',
          address: '321 Rue Delete',
          zipCode: '33000',
        },
      }).then((response) => {
        clubId = response.body.id;
      });
    });

    it('should delete a club from list page', () => {
      cy.visit('http://localhost:3000/clubs');

      // Find the club row and click delete icon
      cy.contains('tr', 'Delete Test Club').within(() => {
        cy.get('[data-icon="delete"]').click();
      });

      // Confirm deletion
      cy.contains('button', 'Supprimer').click();

      // Club should be removed
      cy.contains('Delete Test Club').should('not.exist');
    });

    it('should delete a club from detail page', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}`);

      cy.contains('button', 'Supprimer').click();

      // Confirm deletion in modal
      cy.contains('button', 'Supprimer').click();

      // Should redirect to clubs list
      cy.url().should('include', '/clubs');
      cy.url().should('not.include', clubId);
    });
  });

  describe('Search and Filters', () => {
    before(() => {
      // Create test clubs with different cities
      const clubs = [
        { name: 'Paris Test Club', city: 'Paris', email: 'paris@test.com' },
        { name: 'Lyon Test Club', city: 'Lyon', email: 'lyon@test.com' },
        { name: 'Nice Test Club', city: 'Nice', email: 'nice@test.com' },
      ];

      clubs.forEach((club) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:8090/api/clubs',
          headers: {
            'X-User-Email': testUser.email,
          },
          body: {
            ...club,
            phone: '0123456789',
            address: '1 Rue Test',
            zipCode: '00000',
          },
        });
      });
    });

    it('should search clubs by name', () => {
      cy.visit('http://localhost:3000/clubs');

      cy.get('input[placeholder*="Rechercher"]').type('Paris');
      cy.get('input[placeholder*="Rechercher"]').parent().find('button').click();

      cy.wait(1000);
      cy.get('table tbody tr').should('contain', 'Paris Test Club');
    });

    it('should search clubs by city', () => {
      cy.visit('http://localhost:3000/clubs');

      cy.get('input[placeholder*="Rechercher"]').type('Lyon');
      cy.get('input[placeholder*="Rechercher"]').parent().find('button').click();

      cy.wait(1000);
      cy.get('table tbody tr').should('contain', 'Lyon');
    });
  });

  describe('Club Members', () => {
    let clubId: string;
    let memberId: string;

    before(() => {
      // Create a test club
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/clubs',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          name: `Members Test Club ${Date.now()}`,
          city: 'Nantes',
          email: `membersclub${Date.now()}@test.com`,
          phone: '0123456789',
          address: '111 Rue Members',
          zipCode: '44000',
        },
      }).then((response) => {
        clubId = response.body.id;

        // Create a test member for this club
        cy.request({
          method: 'POST',
          url: 'http://localhost:8090/api/members',
          headers: {
            'X-User-Email': testUser.email,
          },
          body: {
            firstName: 'ClubMember',
            lastName: 'Test',
            email: `clubmember${Date.now()}@test.com`,
            role: 'USER',
            clubId: clubId,
          },
        }).then((memberResponse) => {
          memberId = memberResponse.body.id;
        });
      });
    });

    it('should display club members in detail view', () => {
      cy.visit(`http://localhost:3000/clubs/${clubId}`);

      cy.contains('Membres').should('be.visible');
      cy.contains('ClubMember').should('be.visible');
      cy.contains('Test').should('be.visible');
    });
  });
});
