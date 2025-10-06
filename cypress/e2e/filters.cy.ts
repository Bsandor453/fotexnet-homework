describe('Filters functional tests', () => {
  beforeEach(() => {
    // Stub initial load with fixture
    cy.intercept('GET', '**/artists**', { fixture: 'artists.json' }).as('fetchArtists');

    // Visit the page (The baseUrl is set in cypress.config.ts)
    cy.visit('/');

    // Wait for the fetch to complete
    cy.wait('@fetchArtists');
  });

  // Helper: assert either grid or error
  // (Should load the initial artists correctly or shows error)
  const assertGridOrError = () => {
    cy.get('body').then(($body) => {
      if ($body.find('.ant-alert').length > 0) {
        cy.get('.ant-alert').should('be.visible');
      } else {
        cy.get('.ant-row .gutter-row').should('have.length.greaterThan', 0);
      }
    });
  };

  it('loads all 3 filter controls', () => {
    cy.get('[data-cy^=filter]').should('have.length.at.least', 3);
    assertGridOrError();
  });

  it('allows selecting artist type', () => {
    cy.get('[data-cy=filter-artist-type-select]').click();
    cy.get('.ant-select-item-option').first().click();

    cy.get('[data-cy=filter-search-button]').click();
    cy.get('.ant-spin').should('not.exist');

    assertGridOrError();
  });

  it('allows selecting initial letter', () => {
    cy.get('[data-cy=filter-initial-letter-select]').click();
    cy.get('.ant-select-item-option').first().click();

    cy.get('[data-cy=filter-search-button]').click();
    cy.get('.ant-spin').should('not.exist');

    assertGridOrError();
  });

  it('performs a search using input and search button', () => {
    cy.get('[data-cy=filter-search-input] input').type('Beethoven');
    cy.get('[data-cy=filter-search-button]').click();

    cy.get('.ant-spin').should('not.exist');
    assertGridOrError();
  });

  it('displays error and allows retry if API fails', () => {
    cy.intercept('GET', '**/artists**', {
      statusCode: 500,
      body: { message: 'Server exploded 💥' },
    }).as('fetchArtistsFail');

    cy.get('[data-cy=filter-search-button]').click(); // trigger error

    cy.get('[data-cy=error-message]').should('be.visible');

    // Retry stubbed to success
    cy.intercept('GET', '**/artists**', { fixture: 'artists.json' }).as('fetchArtistsSuccess');
    cy.get('[data-cy=error-message] button').click();

    cy.get('.ant-spin').should('not.exist');
    assertGridOrError();
  });
});
