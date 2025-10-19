describe('Articles Feature', () => {
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
    it('should display Articles menu item', () => {
      cy.contains('Articles').should('be.visible');
    });

    it('should navigate to Articles page when clicking menu', () => {
      cy.contains('Articles').click();
      cy.url().should('include', '/articles');
      cy.contains('Articles').should('be.visible'); // Page title
    });
  });

  describe('Articles List Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/articles');
    });

    it('should display the articles list page with statistics', () => {
      cy.contains('Articles').should('be.visible');
      cy.contains('Total').should('be.visible');
      cy.contains('Publiés').should('be.visible');
      cy.contains('Brouillons').should('be.visible');
      cy.contains('Archivés').should('be.visible');
    });

    it('should have a "Nouvel Article" button', () => {
      cy.contains('button', 'Nouvel Article').should('be.visible');
    });

    it('should have search and filter options', () => {
      cy.get('input[placeholder*="Rechercher"]').should('be.visible');
      cy.contains('Statut').should('exist');
      cy.contains('Catégorie').should('exist');
    });

    it('should display articles table with correct columns', () => {
      cy.contains('th', 'Titre').should('be.visible');
      cy.contains('th', 'Catégorie').should('be.visible');
      cy.contains('th', 'Statut').should('be.visible');
      cy.contains('th', 'Auteur').should('be.visible');
      cy.contains('th', 'Vues').should('be.visible');
      cy.contains('th', 'Modifié le').should('be.visible');
      cy.contains('th', 'Actions').should('be.visible');
    });
  });

  describe('Create Article', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/articles/new');
    });

    it('should display the article creation form', () => {
      cy.contains('Nouvel Article').should('be.visible');
      cy.get('input[placeholder*="Titre"]').should('be.visible');
      cy.contains('Slug').should('be.visible');
      cy.contains('Catégorie').should('be.visible');
      cy.contains('Contenu').should('be.visible');
    });

    it('should create a new article', () => {
      const articleTitle = `Test Article ${Date.now()}`;
      const articleSlug = `test-article-${Date.now()}`;

      // Fill in basic information
      cy.get('input[placeholder*="Titre"]').type(articleTitle);
      cy.get('input[placeholder="mon-article"]').clear().type(articleSlug);

      // Select category
      cy.contains('label', 'Catégorie').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'Actualités').click();

      // Add excerpt
      cy.get('textarea[placeholder*="Résumé"]').type('Ceci est un résumé de test');

      // Wait for Editor.js to load
      cy.wait(2000);

      // Add content using Editor.js
      // The editor should be in an iframe or contenteditable div
      cy.get('.codex-editor').should('be.visible');

      // Try to type in the editor (Editor.js specific)
      cy.get('.ce-block').first().type('Ceci est le contenu de test de l\'article');

      // Save as draft
      cy.contains('button', 'Créer l\'Article').click();

      // Should redirect to article view page
      cy.url().should('match', /\/articles\/[a-f0-9-]+$/);
      cy.contains(articleTitle).should('be.visible');
    });

    it('should generate slug automatically from title', () => {
      const articleTitle = 'Mon Super Article de Test';

      cy.get('input[placeholder*="Titre"]').type(articleTitle);
      cy.get('input[placeholder*="Titre"]').blur();

      // Check that slug was generated
      cy.get('input[placeholder="mon-article"]').should('have.value', 'mon-super-article-de-test');
    });

    it('should validate required fields', () => {
      // Try to submit without filling required fields
      cy.contains('button', 'Créer l\'Article').click();

      // Should show validation errors
      cy.contains('Le titre est requis').should('be.visible');
      cy.contains('La catégorie est requise').should('be.visible');
    });
  });

  describe('Edit Article', () => {
    let articleId: string;

    before(() => {
      // Create a test article via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/articles',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          title: 'Article for Edit Test',
          slug: `edit-test-${Date.now()}`,
          content: JSON.stringify({
            time: Date.now(),
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: 'Original content',
                },
              },
            ],
          }),
          excerpt: 'Original excerpt',
          category: 'NEWS',
          featured: false,
        },
      }).then((response) => {
        articleId = response.body.id;
      });
    });

    it('should display the edit form with existing article data', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}/edit`);

      cy.contains('Modifier l\'Article').should('be.visible');
      cy.get('input[placeholder*="Titre"]').should('have.value', 'Article for Edit Test');
      cy.get('textarea[placeholder*="Résumé"]').should('have.value', 'Original excerpt');
    });

    it('should update an article', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}/edit`);

      const newTitle = `Updated Article ${Date.now()}`;

      cy.get('input[placeholder*="Titre"]').clear().type(newTitle);
      cy.get('textarea[placeholder*="Résumé"]').clear().type('Updated excerpt');

      cy.contains('button', 'Enregistrer les Modifications').click();

      // Should redirect to article view
      cy.url().should('include', `/articles/${articleId}`);
      cy.contains(newTitle).should('be.visible');
      cy.contains('Updated excerpt').should('be.visible');
    });
  });

  describe('View Article', () => {
    let articleId: string;

    before(() => {
      // Create a test article via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/articles',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          title: 'Article for View Test',
          slug: `view-test-${Date.now()}`,
          content: JSON.stringify({
            time: Date.now(),
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: 'Test content for viewing',
                },
              },
            ],
          }),
          excerpt: 'Test excerpt',
          category: 'NEWS',
          tags: ['test', 'cypress'],
          featured: false,
        },
      }).then((response) => {
        articleId = response.body.id;
      });
    });

    it('should display article details', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}`);

      cy.contains('Article for View Test').should('be.visible');
      cy.contains('Test excerpt').should('be.visible');
      cy.contains('Actualités').should('be.visible'); // Category label
      cy.contains('Brouillon').should('be.visible'); // Status
      cy.contains('test').should('be.visible'); // Tag
      cy.contains('cypress').should('be.visible'); // Tag
    });

    it('should have action buttons', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}`);

      cy.contains('button', 'Modifier').should('be.visible');
      cy.contains('button', 'Publier').should('be.visible');
      cy.contains('button', 'Archiver').should('be.visible');
      cy.contains('button', 'Supprimer').should('be.visible');
    });

    it('should navigate to edit page when clicking Modifier', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}`);

      cy.contains('button', 'Modifier').click();
      cy.url().should('include', `/articles/${articleId}/edit`);
    });
  });

  describe('Article Actions', () => {
    let articleId: string;

    beforeEach(() => {
      // Create a fresh test article for each test
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/articles',
        headers: {
          'X-User-Email': testUser.email,
        },
        body: {
          title: `Action Test Article ${Date.now()}`,
          slug: `action-test-${Date.now()}`,
          content: JSON.stringify({
            time: Date.now(),
            blocks: [{ type: 'paragraph', data: { text: 'Test content' } }],
          }),
          category: 'NEWS',
        },
      }).then((response) => {
        articleId = response.body.id;
      });
    });

    it('should publish an article', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}`);

      cy.contains('button', 'Publier').click();

      // Check status changed
      cy.contains('Publié').should('be.visible');
      cy.contains('button', 'Dépublier').should('be.visible');
    });

    it('should archive an article', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}`);

      cy.contains('button', 'Archiver').click();

      // Check status changed
      cy.contains('Archivé').should('be.visible');
    });

    it('should delete an article', () => {
      cy.visit(`http://localhost:3000/articles/${articleId}`);

      cy.contains('button', 'Supprimer').click();

      // Confirm deletion in popup
      cy.contains('Confirmer la suppression').click();

      // Should redirect to articles list
      cy.url().should('include', '/articles');
      cy.url().should('not.include', articleId);
    });
  });

  describe('Search and Filters', () => {
    before(() => {
      // Create multiple test articles with different statuses and categories
      const articles = [
        { title: 'Published News Article', category: 'NEWS', publish: true },
        { title: 'Draft Tutorial Article', category: 'TUTORIAL', publish: false },
        { title: 'Published Event Article', category: 'EVENTS', publish: true },
      ];

      articles.forEach((article) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:8090/api/articles',
          headers: {
            'X-User-Email': testUser.email,
          },
          body: {
            title: article.title,
            slug: article.title.toLowerCase().replace(/\s+/g, '-'),
            content: JSON.stringify({
              time: Date.now(),
              blocks: [{ type: 'paragraph', data: { text: 'Content' } }],
            }),
            category: article.category,
          },
        }).then((response) => {
          if (article.publish) {
            cy.request({
              method: 'PATCH',
              url: `http://localhost:8090/api/articles/${response.body.id}/publish`,
              headers: {
                'X-User-Email': testUser.email,
              },
            });
          }
        });
      });
    });

    it('should filter articles by status', () => {
      cy.visit('http://localhost:3000/articles');

      // Filter by Published
      cy.contains('Statut').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'Publié').click();

      // Check table only shows published articles
      cy.wait(1000);
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain', 'Publié');
      });
    });

    it('should filter articles by category', () => {
      cy.visit('http://localhost:3000/articles');

      // Filter by EVENTS
      cy.contains('Catégorie').parent().find('.ant-select').click();
      cy.contains('.ant-select-item', 'Événements').click();

      // Check table only shows event articles
      cy.wait(1000);
      cy.get('table tbody tr').should('have.length.at.least', 1);
      cy.get('table tbody tr').first().should('contain', 'Événements');
    });

    it('should search articles by title', () => {
      cy.visit('http://localhost:3000/articles');

      cy.get('input[placeholder*="Rechercher"]').type('Published News');
      cy.get('input[placeholder*="Rechercher"]').parent().find('button').click();

      cy.wait(1000);
      cy.get('table tbody tr').should('contain', 'Published News Article');
    });
  });
});
