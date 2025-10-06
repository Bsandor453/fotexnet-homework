describe('Basic tests that check page loading', () => {
  beforeEach(() => {
    // Intercept the API that fetches the grid items
    cy.intercept('GET', 'https://exam.api.fotex.net/api/artists*').as('fetchArtists');

    // Visit the page (The baseUrl is set in cypress.config.ts)
    cy.visit('/');
  });

  it('should load the page', () => {
    // Check that the body has loaded
    cy.get('body').should('exist');
  });

  it('should have a header, main content and footer', () => {
    // Check that the header exists and is visible
    cy.get('header').should('exist').and('be.visible');

    // Check that the main content wrapper exists
    cy.get('main').should('exist').and('be.visible');

    // Check that the footer exists and is visible
    cy.get('footer').should('exist').and('be.visible');
  });

  it('should render grid or show error based on API response', () => {
    // Check if a grid item exists, but only if there is no error (check for the error message otherwise)
    cy.wait('@fetchArtists').then((interception) => {
      const statusCode = interception.response?.statusCode;

      if (statusCode && statusCode >= 200 && statusCode < 300) {
        // Successful API response -> check grid
        cy.get('.ant-row .ant-col').should('have.length.greaterThan', 0);
      } else {
        // Failed API response -> show error message
        cy.get('[data-cy=error-message]').should('exist').and('be.visible');
      }
    });
  });

  it('should have all filter controls and the search button', () => {
    cy.get('#filters [data-cy^=filter]').should('have.length', 4);
  });

  it('should render pagination if grid is present or show error', () => {
    // Check if the pagination exists, but only if there is no error (check for the error message otherwise)
    cy.wait('@fetchArtists').then((interception) => {
      const statusCode = interception.response?.statusCode;

      if (statusCode && statusCode >= 200 && statusCode < 300) {
        cy.get('ul.ant-pagination').should('exist');
      } else {
        cy.get('[data-cy=error-message]').should('exist').and('be.visible');
      }
    });
  });
});
