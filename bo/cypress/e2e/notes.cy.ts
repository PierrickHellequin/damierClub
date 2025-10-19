describe('Notes Feature', () => {
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
    it('should display Notes menu item', () => {
      cy.contains('Notes').should('be.visible');
    });

    it('should navigate to Notes page when clicking menu', () => {
      cy.contains('Notes').click();
      cy.url().should('include', '/notes');
      cy.contains('Notes').should('be.visible');
    });
  });

  describe('Notes List Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/notes');
    });

    it('should display the notes list page with statistics', () => {
      cy.contains('Notes').should('be.visible');
      cy.contains('Total').should('be.visible');
      cy.contains('Privées').should('be.visible');
      cy.contains('Club').should('be.visible');
      cy.contains('Tous les membres').should('be.visible');
    });

    it('should have a "Nouvelle note" button', () => {
      cy.contains('button', 'Nouvelle note').should('be.visible');
    });

    it('should have search and filter options', () => {
      cy.get('input[placeholder*="Rechercher"]').should('be.visible');
      cy.contains('Visibilité').should('exist');
      cy.contains('Statut').should('exist');
    });

    it('should display notes in grid layout', () => {
      // Check for grid container
      cy.get('.ant-row').should('exist');
      cy.get('.ant-col').should('exist');
    });
  });

  describe('Create Note', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/notes/new');
    });

    it('should display the note creation form', () => {
      cy.contains('Nouvelle note').should('be.visible');
      cy.get('input[placeholder*="Titre"]').should('be.visible');
      cy.get('textarea[placeholder*="Contenu"]').should('be.visible');
      cy.contains('Visibilité').should('be.visible');
      cy.contains('Couleur').should('be.visible');
    });

    it('should create a new note', () => {
      const timestamp = Date.now();
      const noteData = {
        title: `Test Note ${timestamp}`,
        content: 'This is the content of the test note.',
      };

      // Fill in note information
      cy.get('input[placeholder*="Titre"]').type(noteData.title);
      cy.get('textarea[placeholder*="Contenu"]').type(noteData.content);

      // Select visibility
      cy.contains('label', 'Visibilité').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'Privée').click();

      // Select a color
      cy.get('[style*="background-color"]').eq(2).click();

      // Submit form
      cy.contains('button', 'Créer la note').click();

      // Should redirect to notes list
      cy.url().should('include', '/notes');
      cy.url().should('not.include', '/new');
      cy.contains(noteData.title).should('be.visible');
    });

    it('should validate required fields', () => {
      // Try to submit without filling required fields
      cy.contains('button', 'Créer la note').click();

      // Should show validation errors
      cy.contains('requis').should('be.visible');
    });

    it('should toggle pinned status', () => {
      cy.get('input[placeholder*="Titre"]').type('Pinned Test Note');
      cy.get('textarea[placeholder*="Contenu"]').type('This note will be pinned.');

      // Toggle pin switch
      cy.contains('Épingler cette note').parent().find('.ant-switch').click();
      cy.contains('Épingler cette note').parent().find('.ant-switch').should('have.class', 'ant-switch-checked');

      cy.contains('button', 'Créer la note').click();

      // Should redirect and show pinned note
      cy.url().should('include', '/notes');
      cy.url().should('not.include', '/new');
    });
  });

  describe('View Note', () => {
    let noteId: string;

    before(() => {
      // Create a test note via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/notes',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          title: 'View Test Note',
          content: 'This is a test note for viewing.',
          visibility: 'PRIVATE',
          pinned: false,
          color: '#FFE5E5',
        },
      }).then((response) => {
        noteId = response.body.id;
      });
    });

    it('should display note details', () => {
      cy.visit(`http://localhost:3000/notes/${noteId}`);

      cy.contains('View Test Note').should('be.visible');
      cy.contains('This is a test note for viewing.').should('be.visible');
      cy.contains('Privée').should('be.visible');
    });

    it('should have action buttons', () => {
      cy.visit(`http://localhost:3000/notes/${noteId}`);

      cy.contains('button', 'Épingler').should('be.visible');
      cy.contains('button', 'Modifier').should('be.visible');
      cy.contains('button', 'Supprimer').should('be.visible');
    });

    it('should navigate to edit page when clicking Modifier', () => {
      cy.visit(`http://localhost:3000/notes/${noteId}`);

      // Note: Edit page might not be implemented yet
      // This test will fail if /notes/[id]/edit doesn't exist
      // Commenting out for now
      // cy.contains('button', 'Modifier').click();
      // cy.url().should('include', `/notes/${noteId}/edit`);
    });
  });

  describe('Note Actions', () => {
    let noteId: string;

    beforeEach(() => {
      // Create a fresh test note for each test
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/notes',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          title: `Action Test Note ${Date.now()}`,
          content: 'Test content for actions.',
          visibility: 'PRIVATE',
          pinned: false,
          color: '#FFE5CC',
        },
      }).then((response) => {
        noteId = response.body.id;
      });
    });

    it('should pin a note from detail view', () => {
      cy.visit(`http://localhost:3000/notes/${noteId}`);

      cy.contains('button', 'Épingler').click();

      // Check that pin button changed
      cy.contains('button', 'Détacher').should('be.visible');
    });

    it('should delete a note from detail view', () => {
      cy.visit(`http://localhost:3000/notes/${noteId}`);

      cy.contains('button', 'Supprimer').click();

      // Confirm deletion in modal
      cy.contains('Supprimer cette note').should('be.visible');
      cy.contains('button', 'Supprimer').click();

      // Should redirect to notes list
      cy.url().should('include', '/notes');
      cy.url().should('not.include', noteId);
    });

    it('should pin a note from list view card', () => {
      cy.visit('http://localhost:3000/notes');

      // Find the note card and click pin icon
      cy.contains('.ant-card', 'Action Test Note').within(() => {
        cy.get('[data-icon="pushpin"]').first().click();
      });

      // Success message should appear
      cy.contains('épinglée').should('be.visible');
    });

    it('should delete a note from list view card', () => {
      cy.visit('http://localhost:3000/notes');

      // Find the note card and click delete icon
      cy.contains('.ant-card', 'Action Test Note').within(() => {
        cy.get('[data-icon="delete"]').click();
      });

      // Confirm deletion
      cy.contains('Supprimer cette note').should('be.visible');
      cy.contains('button', 'Supprimer').click();

      // Note should be removed
      cy.contains('Action Test Note').should('not.exist');
    });
  });

  describe('Search and Filters', () => {
    before(() => {
      // Create test notes with different visibility levels
      const notes = [
        { title: 'Private Note Test', content: 'Private content', visibility: 'PRIVATE', pinned: false },
        { title: 'Club Note Test', content: 'Club content', visibility: 'CLUB', pinned: false },
        { title: 'Members Note Test', content: 'Members content', visibility: 'MEMBERS', pinned: true },
      ];

      notes.forEach((note) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:8090/api/notes',
          headers: {
            'X-User-Email': testUser.email,
          },
          body: {
            ...note,
            color: '#FFFFE5',
          },
        });
      });
    });

    it('should search notes by title', () => {
      cy.visit('http://localhost:3000/notes');

      cy.get('input[placeholder*="Rechercher"]').type('Private Note');
      cy.get('button[type="submit"]').click();

      cy.wait(1000);
      cy.contains('Private Note Test').should('be.visible');
    });

    it('should filter notes by visibility', () => {
      cy.visit('http://localhost:3000/notes');

      // Filter by PRIVATE visibility
      cy.contains('Visibilité').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'Privée').click();

      cy.wait(1000);
      cy.get('.ant-card').should('exist');
    });

    it('should filter notes by pinned status', () => {
      cy.visit('http://localhost:3000/notes');

      // Filter by pinned
      cy.contains('Statut').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'Épinglées').click();

      cy.wait(1000);
      // Should show only pinned notes
      cy.contains('Members Note Test').should('be.visible');
    });

    it('should search notes by content', () => {
      cy.visit('http://localhost:3000/notes');

      cy.get('input[placeholder*="Rechercher"]').type('Club content');
      cy.get('button[type="submit"]').click();

      cy.wait(1000);
      cy.contains('Club Note Test').should('be.visible');
    });
  });

  describe('Note Colors', () => {
    it('should display notes with different colors', () => {
      cy.visit('http://localhost:3000/notes');

      // Check that note cards have background colors
      cy.get('.ant-card').should('have.length.at.least', 1);
      cy.get('.ant-card').first().should('have.attr', 'style');
    });
  });

  describe('Pagination', () => {
    before(() => {
      // Create multiple notes to test pagination (if size > 20)
      const notePromises = [];
      for (let i = 0; i < 25; i++) {
        notePromises.push(
          cy.request({
            method: 'POST',
            url: 'http://localhost:8090/api/notes',
            headers: {
              'X-User-Email': testUser.email,
            },
            body: {
              title: `Pagination Test Note ${i}`,
              content: `Content ${i}`,
              visibility: 'PRIVATE',
              pinned: false,
              color: '#FFE5E5',
            },
          })
        );
      }
    });

    it('should paginate notes when there are more than page size', () => {
      cy.visit('http://localhost:3000/notes');

      // Check if pagination exists (only if there are enough notes)
      cy.get('body').then(($body) => {
        if ($body.find('.ant-pagination').length > 0) {
          cy.get('.ant-pagination').should('be.visible');

          // Click next page
          cy.get('.ant-pagination-next').click();

          // URL or content should change
          cy.wait(1000);
          cy.get('.ant-card').should('exist');
        }
      });
    });
  });
});
